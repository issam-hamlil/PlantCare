const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

describe('ML Service Connection Tests', () => {
  const ML_SERVICE_URL = 'http://localhost:5001';

  beforeAll(async () => {
    console.log('Checking if ML service is ready...');
    // Wait for service to be ready
    let retries = 5;
    while (retries > 0) {
      try {
        await axios.get(`${ML_SERVICE_URL}/health`);
        console.log('ML service is ready!');
        break;
      } catch (error) {
        console.log(`Waiting for ML service... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        retries--;
      }
    }
  }, 15000);

  test('ML service is running and accessible', async () => {
    try {
      console.log('Testing ML service connection...');
      const response = await axios.get(`${ML_SERVICE_URL}/health`);
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('ok');
      console.log('ML service test passed!');
    } catch (error) {
      console.error('Test failed:', error.message);
      throw new Error(`ML service error: ${error.message}`);
    }
  }, 10000);

  test('ML service can analyze plant image', async () => {
    console.log('Testing plant analysis...');
    
    const testImagePath = path.join(__dirname, 'test-plant.jpg');
    if (!fs.existsSync(testImagePath)) {
      console.log('Please add a test image at:', testImagePath);
      return;
    }

    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));

    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
      });

      expect(response.status).toBe(200);
      // Update expectations to match actual response format
      expect(response.data).toHaveProperty('health');
      expect(response.data).toHaveProperty('care_tips');
      expect(response.data).toHaveProperty('treatment');
      expect(response.data).toHaveProperty('confidence');
      
      console.log('Analysis result:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Analysis failed:', error.message);
      throw error;
    }
  }, 30000);
});