import { body, param, query } from 'express-validator';

/**
 * Validation rules for user registration
 * @returns {Array} Array of validation middleware
 */
export const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*\d)(?=.*[a-zA-Z])/)
    .withMessage('Password must contain at least one letter and one number')
];

/**
 * Validation rules for user login
 * @returns {Array} Array of validation middleware
 */
export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for password update
 * @returns {Array} Array of validation middleware
 */
export const passwordUpdateValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*\d)(?=.*[a-zA-Z])/)
    .withMessage('New password must contain at least one letter and one number')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password cannot be the same as current password');
      }
      return true;
    }),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

/**
 * Validation rules for profile update
 * @returns {Array} Array of validation middleware
 */
export const profileUpdateValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('notificationPreferences')
    .optional()
    .isObject()
    .withMessage('Notification preferences must be an object')
];

/**
 * Validation rules for adding a new plant
 * @returns {Array} Array of validation middleware
 */
export const plantValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Plant name is required')
    .isLength({ max: 50 })
    .withMessage('Plant name cannot be more than 50 characters'),
  
  body('species')
    .trim()
    .notEmpty()
    .withMessage('Plant species is required'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  
  body('location')
    .optional()
    .trim()
    .isIn(['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Balcony', 'Garden', 'Other'])
    .withMessage('Invalid location'),
  
  body('acquisitionDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Invalid acquisition date format'),
  
  body('care')
    .optional()
    .isObject()
    .withMessage('Care instructions must be an object')
];

/**
 * Validation rules for plant ID parameter
 * @returns {Array} Array of validation middleware
 */
export const plantIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Plant ID is required')
    .isMongoId()
    .withMessage('Invalid plant ID format')
];

/**
 * Validation rules for notification ID parameter
 * @returns {Array} Array of validation middleware
 */
export const notificationIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Notification ID is required')
    .isMongoId()
    .withMessage('Invalid notification ID format')
];

/**
 * Validation rules for diagnosis creation
 * @returns {Array} Array of validation middleware
 */
export const diagnosisValidator = [
  param('plantId')
    .notEmpty()
    .withMessage('Plant ID is required')
    .isMongoId()
    .withMessage('Invalid plant ID format'),
  
  body('symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array')
];

/**
 * Validation rules for pagination parameters
 * @returns {Array} Array of validation middleware
 */
export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt()
];

/**
 * Validation rules for plant filtering
 * @returns {Array} Array of validation middleware
 */
export const plantFilterValidator = [
  query('location')
    .optional()
    .isIn(['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Balcony', 'Garden', 'Other'])
    .withMessage('Invalid location'),
  
  query('search')
    .optional()
    .trim()
    .escape(),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'species', 'acquisitionDate', 'updatedAt'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

/**
 * Validation rules for password reset request
 * @returns {Array} Array of validation middleware
 */
export const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

/**
 * Validation rules for password reset
 * @returns {Array} Array of validation middleware
 */
export const resetPasswordValidator = [
  body('resetToken')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*\d)(?=.*[a-zA-Z])/)
    .withMessage('Password must contain at least one letter and one number'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

/**
 * Validation rules for search parameters
 * @returns {Array} Array of validation middleware
 */
export const searchValidator = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('category')
    .optional()
    .isIn(['plants', 'diagnoses', 'notifications'])
    .withMessage('Invalid category')
];

/**
 * Validation rules for date range parameters
 * @returns {Array} Array of validation middleware
 */
export const dateRangeValidator = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO date')
    .custom((value, { req }) => {
      if (req.query.startDate && new Date(value) <= new Date(req.query.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];

/**
 * Validation rules for file upload
 * @returns {Array} Array of validation middleware
 */
export const fileUploadValidator = [
  body('image')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('Image file is required');
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('Only JPEG, JPG, PNG, and GIF files are allowed');
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }
      
      return true;
    })
];

/**
 * Validation rules for notification preferences
 * @returns {Array} Array of validation middleware
 */
export const notificationPreferencesValidator = [
  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  
  body('pushNotifications')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  
  body('wateringReminders')
    .optional()
    .isBoolean()
    .withMessage('Watering reminders must be a boolean'),
  
  body('healthAlerts')
    .optional()
    .isBoolean()
    .withMessage('Health alerts must be a boolean')
];

export { body, param, query };