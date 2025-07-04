import api, { USE_MOCK_DATA, ML_SERVICE_URL } from './api';
import axios from 'axios';

export interface Plant {
  id: string;
  species: string;
  name?: string;
  healthStatus: 'healthy' | 'warning' | 'unhealthy';
  recommendations: string[];
  imagePath: string;
  lastWatered?: string | null;
  diseaseName?: string;
  waterFrequency?: number;
  sunlight?: string;
  humidity?: string;
  notes?: string;
  image?: string; // For backward compatibility
}

// Mock data for development
const mockPlants: Plant[] = [
  {
    id: '1',
    species: 'Monstera',
    name: 'Monstera Deliciosa',
    healthStatus: 'healthy',
    recommendations: ['Water once a week', 'Provide indirect sunlight'],
    imagePath: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg',
    waterFrequency: 7,
    sunlight: 'Indirect',
    humidity: 'Medium',
    lastWatered: null
  },
  {
    id: '2',
    species: 'Sansevieria trifasciata',
    name: 'Snake Plant',
    healthStatus: 'healthy',
    recommendations: ['Water every two weeks', 'Low light is fine'],
    imagePath: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg',
    waterFrequency: 14,
    sunlight: 'Low',
    humidity: 'Low',
    lastWatered: null
  },
  {
    id: '3',
    species: 'Ficus lyrata',
    name: 'Fiddle Leaf Fig',
    healthStatus: 'warning',
    recommendations: ['Water every 10 days', 'Keep in bright, indirect light'],
    imagePath: 'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg',
    waterFrequency: 10,
    sunlight: 'Bright indirect',
    humidity: 'Medium-high',
    lastWatered: null
  },
  {
    id: '4',
    species: 'Epipremnum aureum',
    name: 'Pothos',
    healthStatus: 'unhealthy',
    diseaseName: 'Leaf Spot',
    recommendations: ['Treat with fungicide', 'Improve air circulation', 'Reduce watering'],
    imagePath: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg',
    waterFrequency: 7,
    sunlight: 'Low to medium',
    humidity: 'Medium',
    lastWatered: null
  }
];

export async function getUserPlants(): Promise<Plant[]> {
  try {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for plants:', mockPlants);
      return Promise.resolve([...mockPlants]); // Return a copy to avoid reference issues
    }
    
    const response = await api.get('/plants');
    console.log('Fetched plants from API:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching plants:', error);
    throw error;
  }
}

export async function getPlantById(id: string): Promise<Plant> {
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plant = mockPlants.find(p => p.id === id);
        if (plant) {
          resolve({...plant});
        } else {
          reject(new Error('Plant not found'));
        }
      }, 300);
    });
  }
  
  // Real API call
  try {
    const response = await api.get(`/plants/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching plant ${id}:`, error);
    throw error;
  }
}

export async function addPlant(plantData: Omit<Plant, 'id'>): Promise<Plant> {
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    return new Promise(resolve => {
      setTimeout(() => {
        const newPlant = {
          ...plantData,
          id: (mockPlants.length + 1).toString(),
          dateAdded: new Date().toISOString().split('T')[0]
        };
        mockPlants.push(newPlant);
        resolve(newPlant);
      }, 500);
    });
  }
  
  // Real API call
  try {
    const formData = new FormData();
    Object.entries(plantData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    const response = await api.post('/plants/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error adding plant:', error);
    throw error;
  }
}

export async function updatePlant(id: string, plantData: Partial<Plant>): Promise<Plant> {
  console.log(`updatePlant called for plant ${id} with data:`, plantData);
  
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const index = mockPlants.findIndex(p => p.id === id);
          if (index !== -1) {
            console.log('Found plant in mock data at index', index);
            console.log('Before update:', mockPlants[index]);
            
            // Create a deep copy to avoid reference issues
            mockPlants[index] = { 
              ...mockPlants[index], 
              ...plantData 
            };
            
            console.log('After update:', mockPlants[index]);
            resolve({...mockPlants[index]});
          } else {
            console.error('Plant not found in mock data');
            reject(new Error('Plant not found'));
          }
        } catch (error) {
          console.error('Error in mock updatePlant:', error);
          reject(error);
        }
      }, 500);
    });
  }
  
  // Real API call
  try {
    console.log('Updating plant with data:', plantData);
    
    // Convert the data to a format the API expects
    const apiData = { ...plantData };
    
    // Special handling for lastWatered field
    if (plantData.lastWatered === null) {
      console.log('Setting lastWatered to null');
      apiData.lastWatered = null;
    }
    
    // Use JSON format instead of FormData for better compatibility
    console.log('Sending API request with data:', apiData);
    const response = await api.put(`/plants/${id}`, apiData);
    console.log('API response:', response);
    
    return response.data.data;
  } catch (error) {
    console.error(`Error updating plant ${id}:`, error);
    throw error;
  }
}

export async function deletePlant(id: string): Promise<void> {
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockPlants.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPlants.splice(index, 1);
          resolve();
        } else {
          reject(new Error('Plant not found'));
        }
      }, 500);
    });
  }
  
  // Real API call
  try {
    await api.delete(`/plants/${id}`);
    return;
  } catch (error) {
    console.error(`Error deleting plant ${id}:`, error);
    throw error;
  }
}

export const analyzePlantImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  // Add timestamp to prevent caching
  const timestamp = Date.now();
  formData.append('timestamp', timestamp.toString());

  try {
    // Send to your backend
    const response = await api.post(`/analyze?t=${timestamp}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
      },
    });

    console.log('Analysis result:', response.data);
    
    // Transform the backend response to match frontend expectations
    const backendData = response.data.data;
    
    // Map backend health status to frontend format
    let healthStatus: 'healthy' | 'warning' | 'unhealthy';
    if (backendData.healthStatus === 'healthy') {
      healthStatus = 'healthy';
    } else if (backendData.healthStatus === 'diseased') {
      healthStatus = 'unhealthy';
    } else {
      healthStatus = 'warning';
    }
    
    return {
      species: backendData.species || 'Unknown Plant',
      healthStatus: healthStatus,
      diseaseName: backendData.diseaseName || undefined,
      recommendations: backendData.recommendations || []
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
};

export const saveAnalyzedPlant = async (
  analyzedPlant: { 
    species: string; 
    healthStatus: string;
    diseaseName?: string; 
    recommendations: string[] 
  }, 
  imageFile: File
): Promise<Plant> => {
  const formData = new FormData();
  formData.append('species', analyzedPlant.species);
  formData.append('healthStatus', analyzedPlant.healthStatus);
  if (analyzedPlant.diseaseName) {
    formData.append('diseaseName', analyzedPlant.diseaseName);
  }
  formData.append('recommendations', JSON.stringify(analyzedPlant.recommendations));
  formData.append('image', imageFile);

  try {
    console.log('Saving analyzed plant:', analyzedPlant);
    const response = await api.post('/plants/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Save response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error saving plant:', error);
    throw error;
  }
};