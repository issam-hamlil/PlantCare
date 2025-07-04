import Plant from "../models/Plant.js";
import Diagnosis from "../models/Diagnosis.js";
import Notification from "../models/Notification.js";
import aiService from "../services/aiService.js";
import { uploadImageToStorage } from "../services/plantService.js";

export const diagnosePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    if (plant.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const imageUrl = await uploadImageToStorage(req.file);

    // Call your Flask AI service for diagnosis
    const diagnosisResult = await aiService.diagnosePlant(req.file.path);

    // Create diagnosis record
    const diagnosis = await Diagnosis.create({
      plant: plant._id,
      user: req.user.id,
      imageUrl,
      healthStatus: diagnosisResult.healthStatus || 'unknown',
      aiConfidence: diagnosisResult.confidence || 0,
      issues: diagnosisResult.issues || [],
      recommendations: diagnosisResult.recommendations || []
    });

    // Update plant health status
    plant.currentHealth = diagnosisResult.healthStatus || plant.currentHealth;

    // Add to health history
    plant.healthHistory.push({
      status: diagnosisResult.healthStatus || 'unknown',
      diagnosis: diagnosisResult.issues.length > 0 ? diagnosisResult.issues[0].name : 'No issues detected',
      imageUrl,
      date: new Date()
    });

    await plant.save();

    // Create notification if health issues detected
    if (diagnosisResult.healthStatus && diagnosisResult.healthStatus !== 'healthy') {
      await Notification.create({
        user: req.user.id,
        plant: plant._id,
        type: 'health_alert',
        title: 'Health Issue Detected',
        message: `Your ${plant.name} may have health issues. Check the diagnosis for details.`,
        priority: diagnosisResult.healthStatus === 'severe_issues' ? 'high' : 'medium'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        diagnosis,
        plant
      }
    });
  } catch (error) {
    console.error("Diagnosis error:", error);
    res.status(500).json({ error: "Diagnosis failed" });
  }
};
