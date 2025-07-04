# PlantCare Application

PlantCare is a full-stack application that helps users identify and care for their plants. It uses machine learning to analyze plant images and provide health assessments and care recommendations.

## Architecture

The application consists of three main components:

1. **Frontend**: React application with TypeScript (port 3000)
2. **Backend**: Node.js Express server (port 3002)
3. **ML Service**: Python Flask server with TensorFlow for plant analysis (port 5001)

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- Python 3.8+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for each component:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install ML service dependencies
cd ../ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Application

You can start all services at once using the provided script:

```bash
# On Windows
test-services.bat

# On Unix/Mac
./test-services.sh
```

Or start each service individually:

1. **Start ML Service**:
```bash
cd ml-service
python app.py  # Runs on port 5001
```

2. **Start Backend**:
```bash
cd backend
npm start  # Runs on port 3002
```

3. **Start Frontend**:
```bash
cd frontend
npm run dev  # Typically runs on port 3000
```

## Usage

1. Open the application in your browser (typically at http://localhost:3000)
2. Navigate to the Analysis page
3. Upload a plant image
4. View the analysis results including species identification, health status, and care recommendations

## API Endpoints

### Backend API (http://localhost:3002)

- `POST /api/analyze`: Upload and analyze a plant image
- `GET /api/plants`: Get all user plants
- `POST /api/plants`: Add a new plant
- `GET /api/plants/:id`: Get a specific plant
- `PUT /api/plants/:id`: Update a plant
- `DELETE /api/plants/:id`: Delete a plant

### ML Service API (http://localhost:5001)

- `POST /predict`: Analyze a plant image and return results

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB
- **ML Service**: Python, Flask, TensorFlow, Keras

## Model Information

The current model is trained to recognize tomato plant conditions:
- Healthy tomato plants
- Tomato plants with Late Blight
- Tomato plants with Leaf Mold

## License

This project is licensed under the MIT License - see the LICENSE file for details. 