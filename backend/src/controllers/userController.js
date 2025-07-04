import User from '../models/User.js';
import Plant from '../models/Plant.js';
import Notification from '../models/Notification.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { name, language } = req.body;
    
    // Update fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (language) updateFields.language = language;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user dashboard statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res, next) => {
  try {
    // Get plant count
    const plantCount = await Plant.countDocuments({ user: req.user.id });
    
    // Get healthy vs unhealthy plants
    const healthyCount = await Plant.countDocuments({ 
      user: req.user.id,
      currentHealth: 'healthy'
    });
    
    const issuesCount = await Plant.countDocuments({
      user: req.user.id,
      currentHealth: { $ne: 'healthy', $ne: 'unknown' }
    });
    
    // Get unread notifications count
    const unreadNotifications = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });
    
    // Get plants needing water soon (next 2 days)
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    const plantsNeedingWater = await Plant.find({
      user: req.user.id,
      $expr: {
        $lte: [
          { $add: ['$lastWatered', { $multiply: ['$wateringFrequency', 24 * 60 * 60 * 1000] }] },
          twoDaysFromNow.getTime()
        ]
      }
    }).countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        totalPlants: plantCount,
        healthyPlants: healthyCount,
        plantsWithIssues: issuesCount,
        unreadNotifications,
        plantsNeedingWater
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    // Delete all user's plants, notifications, and diagnoses
    // This will be handled through MongoDB middleware or manually
    
    // Delete the user
    await User.findByIdAndDelete(req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};