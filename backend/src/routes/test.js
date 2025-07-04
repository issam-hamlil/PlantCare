// filepath: c:\Users\issam\Downloads\PlantCare1\PlantCare\backend\src\routes\test.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Test route working!' });
});

export default router;