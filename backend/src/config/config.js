export default {
    // Application Settings
    app: {
      port: process.env.PORT || 5000,
      env: process.env.NODE_ENV || 'development',
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
      jwtExpire: process.env.JWT_EXPIRE || '30d'
    },
    
    // MongoDB Settings
    db: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/plantcare',
    },
    
    // Email Service Settings
    email: {
      service: process.env.EMAIL_SERVICE || 'gmail',
      username: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM
    },
    
    // AI Service Settings
    ai: {
      apiUrl: process.env.AI_API_URL || 'http://localhost:5001/api/predict',
      apiKey: process.env.AI_API_KEY
    },
    
    // Email configuration
    emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
    emailPort: process.env.EMAIL_PORT || 587,
    emailUser: process.env.EMAIL_USER || '',
    emailPass: process.env.EMAIL_PASS || '',
    
    // ML Service configuration
    mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:5000',
    
    // File upload configuration
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  };