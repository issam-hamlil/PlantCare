import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import path from "path";

/**
 * Diagnose plant health issues using your Python Flask AI service
 * @param {string} imagePath - Full path to uploaded image file
 * @returns {Object} Diagnosis results with health issues and care tips
 */
export default async function diagnosePlant(imagePath) {
  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    const response = await axios.post("http://localhost:5001/predict", formData, {
      headers: formData.getHeaders(),
    });

    return {
      healthStatus: response.data.health || "unknown",
      confidence: response.data.confidence,
      issues: [{ name: response.data.label }],
      recommendations: [
        response.data.treatment,
        response.data.care_tips
      ]
    };
  } catch (error) {
    console.error("Error communicating with Flask AI service:", error.message);
    throw new Error("Plant diagnosis failed");
  }
}
