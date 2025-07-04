from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image  # This is the correct import
import numpy as np
import json
import os
import io
import logging
import time
import uuid
from werkzeug.utils import secure_filename

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create directories if they don't exist
os.makedirs("test_images", exist_ok=True)
os.makedirs("data", exist_ok=True)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global variable to store the model path
MODEL_PATH = "model/tomato_disease_model_updated.keras"

# Load model function to ensure fresh model for each prediction
def load_model():
    try:
        # Clear any existing TensorFlow session
        tf.keras.backend.clear_session()
        # Load the model
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info("Model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise

# Define class labels
class_labels = ["Tomato___healthy", "Tomato___Late_blight", "Tomato___Leaf_Mold"]

# Load plant info
def load_plant_info():
    plant_info_path = "data/plant_info.json"
    default_info = {
        "Tomato___healthy": {
            "name": "Tomato",
            "health": "Healthy",
            "treatment": "No treatment needed.",
            "care_tips": "Water regularly. Ensure full sun exposure."
        },
        "Tomato___Leaf_Mold": {
            "name": "Tomato",
            "health": "Leaf Mold",
            "treatment": "Remove affected leaves. Apply fungicide if necessary.",
            "care_tips": "Improve air circulation. Avoid overhead watering."
        },
        "Tomato___Late_blight": {
            "name": "Tomato",
            "health": "Late Blight",
            "treatment": "Apply copper-based fungicide. Remove infected plants.",
            "care_tips": "Avoid wetting leaves. Rotate crops regularly."
        }
    }
    
    try:
        with open(plant_info_path, 'r') as f:
            plant_info = json.load(f)
            # Validate loaded info has all required keys
            for key in default_info:
                if key not in plant_info:
                    plant_info[key] = default_info[key]
                    logger.warning(f"Missing plant info for {key}, using defaults")
            return plant_info
    except (FileNotFoundError, json.JSONDecodeError):
        logger.warning("Plant info file not found or invalid, creating default")
        with open(plant_info_path, 'w') as f:
            json.dump(default_info, f, indent=2)
        return default_info

plant_info = load_plant_info()

@app.route("/")
def home():
    """Root endpoint that provides API information"""
    return jsonify({
        "message": "PlantCare ML Service is running",
        "version": "1.0",
        "endpoints": {
            "predict": {
                "path": "/predict",
                "method": "POST",
                "description": "Upload an image for disease prediction",
                "parameters": {
                    "image": "Image file (JPEG/PNG)"
                }
            }
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok'})

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint for plant disease prediction"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Generate a unique filename with timestamp and UUID
        unique_filename = f"{int(time.time())}_{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        img_path = os.path.join("test_images", unique_filename)
        file.save(img_path)
        logger.info(f"Image saved to {img_path}")

        # Load and preprocess the image
        img = Image.open(img_path)
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Load a fresh model for each prediction
        model = load_model()
        
        # Make prediction
        predictions = model.predict(img_array)
        idx = np.argmax(predictions)
        label = class_labels[idx]
        confidence = float(np.max(predictions))
        logger.info(f"Prediction: {label} with confidence {confidence:.2f}")

        # Clean up the image file after processing
        try:
            os.remove(img_path)
            logger.info(f"Cleaned up temporary image: {img_path}")
        except Exception as e:
            logger.warning(f"Failed to clean up image: {e}")

        # Get plant info
        info = plant_info.get(label, {})
        
        # Transform the response to match frontend expectations
        result = {
            'health': info.get("health", "Unknown"),
            'care_tips': info.get("care_tips", "N/A"),
            'treatment': info.get("treatment", "N/A"),
            'confidence': confidence,
            'name': info.get("name", "Unknown"),
            'label': label
        }
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    # For development
    app.run(host="0.0.0.0", port=5001)
    
    # For production (uncomment when deploying)
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=5001)