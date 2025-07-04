import express from 'express';
import { check } from 'express-validator';
import { 
  updateProfile, 
  changePassword, 
  getUserStats, 
  deleteAccount 
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    check('name', 'Name is required if updating').optional().not().isEmpty(),
    check('language', 'Language must be one of fr, ar, en if updating')
      .optional()
      .isIn(['fr', 'ar', 'en'])
  ],
  updateProfile
);

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put(
  '/password',
  [
    check('currentPassword', 'Current password is required').not().isEmpty(),
    check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 })
  ],
  changePassword
);

// @route   GET /api/users/stats
// @desc    Get user dashboard statistics
// @access  Private
router.get('/stats', getUserStats);

// @route   DELETE /api/users
// @desc    Delete user account
// @access  Private
router.delete('/', deleteAccount);

export default router;