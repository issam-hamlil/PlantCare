import express from 'express';
import multer from 'multer';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, 'test-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// @route   POST /api/analyze
// @desc    Analyze plant image
// @access  Public
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('File uploaded:', req.file.filename);
    console.log('File path:', req.file.path);

    // Create form data for ML service
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));

    // Call ML service
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';
    console.log('Calling ML service at:', mlServiceUrl);

    const response = await axios.post(`${mlServiceUrl}/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('ML service response:', response.data);

    // Process the response
    const result = response.data;
    
    // Determine health status based on confidence and class
    let healthStatus = 'healthy';
    let diseaseName = '';
    
    if (result.confidence > 0.7) {
      if (result.class === 'healthy') {
        healthStatus = 'healthy';
      } else {
        healthStatus = 'diseased';
        diseaseName = result.class;
      }
    } else {
      healthStatus = 'uncertain';
    }

    // Generate recommendations based on the result
    const recommendations = generateRecommendations(result.class, result.confidence);

    res.json({
      success: true,
      data: {
        species: 'Tomato Plant', // Default for now
        healthStatus: healthStatus,
        diseaseName: diseaseName,
        confidence: result.confidence,
        class: result.class,
        recommendations: recommendations,
        imagePath: req.file.filename
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'ML service is not available',
        details: 'The plant analysis service is currently unavailable. Please try again later.'
      });
    }
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: 'ML service error',
        details: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.message 
    });
  }
});

// Helper function to generate recommendations
function generateRecommendations(diseaseClass, confidence) {
  const recommendations = [];
  
  if (confidence < 0.7) {
    recommendations.push('The image quality or lighting may be affecting the analysis. Try taking a clearer photo in better lighting.');
    recommendations.push('Consider consulting with a plant expert for a more accurate diagnosis.');
  }
  
  switch (diseaseClass) {
    case 'healthy':
      recommendations.push('Your plant appears to be healthy! Continue with regular watering and care.');
      recommendations.push('Monitor for any changes in leaf color or texture.');
      break;
    case 'early_blight':
      recommendations.push('Remove and destroy infected leaves to prevent spread.');
      recommendations.push('Improve air circulation around the plant.');
      recommendations.push('Avoid overhead watering to keep leaves dry.');
      recommendations.push('Consider applying a fungicide if the infection is severe.');
      break;
    case 'late_blight':
      recommendations.push('This is a serious disease that can spread quickly.');
      recommendations.push('Remove and destroy all infected plant parts immediately.');
      recommendations.push('Improve air circulation and reduce humidity.');
      recommendations.push('Consider using resistant varieties in the future.');
      break;
    case 'leaf_mold':
      recommendations.push('Improve air circulation and reduce humidity.');
      recommendations.push('Remove infected leaves and avoid overhead watering.');
      recommendations.push('Consider applying a fungicide if necessary.');
      break;
    case 'septoria_leaf_spot':
      recommendations.push('Remove infected leaves and improve air circulation.');
      recommendations.push('Avoid overhead watering and water at the base of the plant.');
      recommendations.push('Consider applying a fungicide if the infection is severe.');
      break;
    case 'spider_mites':
      recommendations.push('Spray the plant with a strong stream of water to dislodge mites.');
      recommendations.push('Apply insecticidal soap or neem oil.');
      recommendations.push('Monitor regularly and repeat treatment if necessary.');
      break;
    case 'target_spot':
      recommendations.push('Remove infected leaves and improve air circulation.');
      recommendations.push('Avoid overhead watering and water at the base of the plant.');
      recommendations.push('Consider applying a fungicide if the infection is severe.');
      break;
    case 'yellow_leaf_curl_virus':
      recommendations.push('This is a viral disease spread by whiteflies.');
      recommendations.push('Remove and destroy infected plants to prevent spread.');
      recommendations.push('Control whitefly populations with insecticides or natural predators.');
      recommendations.push('Use resistant varieties in the future.');
      break;
    case 'mosaic_virus':
      recommendations.push('This is a viral disease that cannot be cured.');
      recommendations.push('Remove and destroy infected plants to prevent spread.');
      recommendations.push('Control aphid populations which can spread the virus.');
      recommendations.push('Use resistant varieties in the future.');
      break;
    default:
      recommendations.push('Monitor the plant closely for any changes.');
      recommendations.push('Consider consulting with a plant expert for proper diagnosis and treatment.');
  }
  
  return recommendations;
}

export default router; 