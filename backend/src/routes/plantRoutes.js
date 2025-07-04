import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Plant from "../models/Plant.js";

const router = express.Router();

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
    cb(null, 'plant-' + uniqueSuffix + extension);
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

// Save analyzed plant to MongoDB
router.post('/save', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Parse recommendations
    let recommendations = [];
    try {
      if (req.body.recommendations) {
        if (typeof req.body.recommendations === 'string') {
          recommendations = JSON.parse(req.body.recommendations);
        } else if (Array.isArray(req.body.recommendations)) {
          recommendations = req.body.recommendations;
        }
      }
    } catch (parseError) {
      recommendations = [];
    }

    // Log the request body for debugging
    console.log('Save plant request body:', req.body);
    console.log('File:', req.file);

    // Save to MongoDB
    const plant = new Plant({
      species: req.body.species || 'Unknown Plant',
      healthStatus: req.body.healthStatus || 'healthy',
      diseaseName: req.body.diseaseName || '',
      recommendations: recommendations,
      imagePath: req.file.filename
    });
    await plant.save();

    // Log the saved plant
    console.log('Plant saved:', {
      id: plant._id,
      species: plant.species,
      healthStatus: plant.healthStatus,
      diseaseName: plant.diseaseName,
      imagePath: plant.imagePath
    });

    res.status(201).json({
      success: true,
      data: {
        id: plant._id,
        species: plant.species,
        healthStatus: plant.healthStatus,
        diseaseName: plant.diseaseName,
        recommendations: plant.recommendations,
        imagePath: plant.imagePath
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save plant', details: error.message });
  }
});

// Get all plants from MongoDB
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    
    // Log the plants for debugging
    console.log('Plants from database:');
    plants.forEach(plant => {
      console.log({
        id: plant._id,
        species: plant.species,
        healthStatus: plant.healthStatus,
        diseaseName: plant.diseaseName,
        imagePath: plant.imagePath,
        lastWatered: plant.lastWatered
      });
    });
    
    res.json({
      data: plants.map(plant => ({
        id: plant._id,
        species: plant.species,
        healthStatus: plant.healthStatus,
        diseaseName: plant.diseaseName,
        recommendations: plant.recommendations,
        imagePath: plant.imagePath,
        lastWatered: plant.lastWatered
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plants', details: error.message });
  }
});

// Update a plant (for watering or other updates)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    
    console.log('Update request body:', req.body);
    
    // Handle lastWatered date
    if (req.body.lastWatered) {
      updateData.lastWatered = new Date(req.body.lastWatered);
      console.log('Setting lastWatered to:', updateData.lastWatered);
    } else if (req.body.lastWatered === null) {
      // If explicitly set to null
      updateData.lastWatered = null;
      console.log('Setting lastWatered to null');
    }
    
    // Handle other potential updates
    if (req.body.species) updateData.species = req.body.species;
    if (req.body.healthStatus) updateData.healthStatus = req.body.healthStatus;
    if (req.body.recommendations) {
      try {
        updateData.recommendations = typeof req.body.recommendations === 'string' 
          ? JSON.parse(req.body.recommendations) 
          : req.body.recommendations;
      } catch (err) {
        console.error('Error parsing recommendations:', err);
      }
    }

    console.log('Update data being applied:', updateData);

    const updatedPlant = await Plant.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPlant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    console.log('Plant updated successfully:', {
      id: updatedPlant._id,
      lastWatered: updatedPlant.lastWatered
    });

    res.json({
      success: true,
      data: {
        id: updatedPlant._id,
        species: updatedPlant.species,
        healthStatus: updatedPlant.healthStatus,
        diseaseName: updatedPlant.diseaseName,
        recommendations: updatedPlant.recommendations,
        imagePath: updatedPlant.imagePath,
        lastWatered: updatedPlant.lastWatered
      }
    });
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ error: 'Failed to update plant', details: error.message });
  }
});

// Delete a plant
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plant = await Plant.findById(id);
    
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }
    
    // Delete the image file if it exists
    if (plant.imagePath) {
      const imagePath = path.join(__dirname, '../../uploads', plant.imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete the plant from the database
    await Plant.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plant', details: error.message });
  }
});

export default router;