import mongoose from 'mongoose';

const DiagnosisSchema = new mongoose.Schema({
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  diagnosis: {
    healthStatus: {
      type: String,
      enum: ['healthy', 'diseased', 'uncertain'],
      default: 'uncertain'
    },
    diseaseName: {
      type: String,
      default: ''
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    class: {
      type: String,
      default: ''
    }
  },
  recommendations: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Diagnosis', DiagnosisSchema);