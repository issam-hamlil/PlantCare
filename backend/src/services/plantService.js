import Plant from '../models/Plant.js';

export const getAllPlants = async () => {
  try {
    const plants = await Plant.find();
    return plants;
  } catch (error) {
    throw new Error('Error fetching plants: ' + error.message);
  }
};

export const getPlantById = async (id) => {
  try {
    const plant = await Plant.findById(id);
    if (!plant) {
      throw new Error('Plant not found');
    }
    return plant;
  } catch (error) {
    throw new Error('Error fetching plant: ' + error.message);
  }
};

export const createPlant = async (plantData) => {
  try {
    const newPlant = new Plant(plantData);
    await newPlant.save();
    return newPlant;
  } catch (error) {
    throw new Error('Error creating plant: ' + error.message);
  }
};

export const updatePlant = async (id, plantData) => {
  try {
    const updatedPlant = await Plant.findByIdAndUpdate(id, plantData, { new: true });
    if (!updatedPlant) {
      throw new Error('Plant not found');
    }
    return updatedPlant;
  } catch (error) {
    throw new Error('Error updating plant: ' + error.message);
  }
};

export const deletePlant = async (id) => {
  try {
    const deletedPlant = await Plant.findByIdAndDelete(id);
    if (!deletedPlant) {
      throw new Error('Plant not found');
    }
    return deletedPlant;
  } catch (error) {
    throw new Error('Error deleting plant: ' + error.message);
  }
};

export const uploadImageToStorage = async (file) => {
  // Implementation for uploading image to storage
  // This is a placeholder - implement based on your storage solution
  return file.filename;
};