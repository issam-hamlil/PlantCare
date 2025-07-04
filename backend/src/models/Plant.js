import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  species: { type: String, required: true },
  healthStatus: { type: String, required: true },
  diseaseName: { type: String, default: '' },
  recommendations: [{ type: String }],
  imagePath: { type: String, required: true },
  lastWatered: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

// Clear any existing model to prevent the "OverwriteModelError"
mongoose.models = {};

export default mongoose.model('Plant', plantSchema); 