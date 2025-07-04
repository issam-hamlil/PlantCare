import nodemailer from 'nodemailer';
import config from '../config/config.js';

/**
 * Email service for sending notifications and alerts to users
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // true for 465, false for other ports
      auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
      }
    });

    // Verify connection configuration
    if (process.env.NODE_ENV === 'production') {
      this.transporter.verify((error) => {
        if (error) {
          console.error('Email service configuration error:', error);
        } else {
          console.log('Email service is ready to send messages');
        }
      });
    }
  }

  /**
   * Send a welcome email to new users
   * 
   * @param {Object} user User object containing name and email
   * @returns {Promise<Object>} Email sending result
   */
  async sendWelcomeEmail(user) {
    try {
      const message = {
        from: `"PlantCare" <${config.email.from}>`,
        to: user.email,
        subject: 'Welcome to PlantCare!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2e7d32;">Welcome to PlantCare, ${user.name}!</h2>
            <p>Thank you for joining our community of plant enthusiasts!</p>
            <p>With PlantCare, you can:</p>
            <ul>
              <li>Identify plants using our AI technology</li>
              <li>Get personalized care schedules for your plants</li>
              <li>Diagnose plant health issues</li>
              <li>Receive timely reminders for watering and care</li>
            </ul>
            <p>Start by adding your first plant in the app!</p>
            <div style="margin: 30px 0;">
              <a href="${config.frontendURL}/dashboard" style="background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Go to Dashboard</a>
            </div>
            <p>Happy gardening!</p>
            <p>The PlantCare Team</p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(message);
      console.log(`Welcome email sent to ${user.email}`);
      return result;
    } catch (error) {
      console.error(`Failed to send welcome email to ${user.email}:`, error);
      throw new Error('Failed to send welcome email');
    }
  }

  /**
   * Send plant care notification email
   * 
   * @param {Object} user User to send email to
   * @param {Object} plant Plant that needs care
   * @param {string} careType Type of care (watering, fertilizing, etc.)
   * @returns {Promise<Object>} Email sending result
   */
  async sendCareReminderEmail(user, plant, careType) {
    try {
      // Skip if user has disabled email notifications
      if (!user.notificationPreferences.email) {
        return null;
      }

      // Customize message based on care type
      let careAction, careAdvice;
      switch (careType) {
        case 'watering':
          careAction = 'water';
          careAdvice = 'Make sure the soil is properly moist but not soggy.';
          break;
        case 'fertilizing':
          careAction = 'fertilize';
          careAdvice = 'Use a balanced fertilizer diluted to half the recommended strength.';
          break;
        case 'repotting':
          careAction = 'consider repotting';
          careAdvice = 'Choose a pot 1-2 inches larger than the current one with good drainage.';
          break;
        default:
          careAction = 'check on';
          careAdvice = 'Regular care keeps your plants healthy and happy.';
      }

      const message = {
        from: `"PlantCare Reminder" <${config.email.from}>`,
        to: user.email,
        subject: `Time to ${careAction} your ${plant.name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2e7d32;">Plant Care Reminder</h2>
            <p>Hello ${user.name},</p>
            <p>It's time to ${careAction} your <strong>${plant.name}</strong> (${plant.species}).</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin-top: 0;"><strong>Care Tip:</strong> ${careAdvice}</p>
            </div>
            
            ${plant.imageUrl ? `<img src="${config.frontendURL}/${plant.imageUrl}" alt="${plant.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px;">` : ''}
            
            <p>You can view more details and mark this task as complete in the app:</p>
            
            <div style="margin: 20px 0;">
              <a href="${config.frontendURL}/plants/${plant._id}" style="background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Plant Details</a>
            </div>
            
            <p>Happy gardening!</p>
            <p>The PlantCare Team</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              You're receiving this email because you've enabled email notifications for plant care reminders.
              <br>
              To change your notification preferences, visit <a href="${config.frontendURL}/settings">Account Settings</a>.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(message);
      console.log(`Care reminder email sent to ${user.email} for ${plant.name}`);
      return result;
    } catch (error) {
      console.error(`Failed to send care reminder email to ${user.email}:`, error);
      // Don't throw, just log - we don't want to break the app flow for email failures
      return null;
    }
  }

  /**
   * Send plant diagnosis results email
   * 
   * @param {Object} user User to send email to
   * @param {Object} plant Plant that was diagnosed
   * @param {Object} diagnosis Diagnosis result data
   * @returns {Promise<Object>} Email sending result
   */
  async sendDiagnosisResultEmail(user, plant, diagnosis) {
    try {
      // Skip if user has disabled email notifications
      if (!user.notificationPreferences.email) {
        return null;
      }

      // Format the health issues and solutions
      let healthIssuesList = '';
      if (diagnosis.healthAssessment && diagnosis.healthAssessment.issues.length > 0) {
        healthIssuesList = diagnosis.healthAssessment.issues.map(issue => `
          <div style="margin-bottom: 15px;">
            <h4 style="margin-bottom: 5px; color: #d32f2f;">${issue.name}</h4>
            <p style="margin-top: 0;">${issue.description}</p>
            <p><strong>Solution:</strong> ${issue.solution}</p>
          </div>
        `).join('');
      } else {
        healthIssuesList = `
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px;">
            <p style="margin: 0; color: #2e7d32;"><strong>Good news!</strong> No health issues were detected in your plant.</p>
          </div>
        `;
      }

      const message = {
        from: `"PlantCare Diagnosis" <${config.email.from}>`,
        to: user.email,
        subject: `Diagnosis Results for your ${plant.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2e7d32;">Plant Health Diagnosis</h2>
            <p>Hello ${user.name},</p>
            <p>Here are the diagnosis results for your <strong>${plant.name}</strong> (${plant.species}):</p>
            
            <div style="margin: 20px 0;">
              ${diagnosis.imageUrl ? `<img src="${config.frontendURL}/${diagnosis.imageUrl}" alt="Diagnosed Plant" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px;">` : ''}
              
              <h3>Health Assessment</h3>
              ${healthIssuesList}
            </div>
            
            <p>View the complete diagnosis and treatment plan in the app:</p>
            
            <div style="margin: 20px 0;">
              <a href="${config.frontendURL}/plants/${plant._id}/diagnoses/${diagnosis._id}" style="background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Complete Results</a>
            </div>
            
            <p>Take care of your plants!</p>
            <p>The PlantCare Team</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              You're receiving this email because you've enabled email notifications.
              <br>
              To change your notification preferences, visit <a href="${config.frontendURL}/settings">Account Settings</a>.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(message);
      console.log(`Diagnosis result email sent to ${user.email} for ${plant.name}`);
      return result;
    } catch (error) {
      console.error(`Failed to send diagnosis result email to ${user.email}:`, error);
      return null;
    }
  }

  /**
   * Send password reset email
   * 
   * @param {Object} user User object containing email and reset token
   * @param {string} resetToken Password reset token
   * @returns {Promise<Object>} Email sending result
   */
  async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `${config.frontendURL}/reset-password/${resetToken}`;
      
      const message = {
        from: `"PlantCare Security" <${config.email.from}>`,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2e7d32;">Reset Your Password</h2>
            <p>Hello,</p>
            <p>You requested a password reset for your PlantCare account.</p>
            <p>Please click the button below to set a new password:</p>
            
            <div style="margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #2e7d32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
            </div>
            
            <p>This link will expire in 10 minutes for security reasons.</p>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            
            <p>The PlantCare Team</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              For security, this request was received from IP: ${user.requestIP || 'Unknown'}
              <br>
              If you have any concerns, please contact support immediately.
            </p>
          </div>
        `
      };

      const result = await this.transporter.sendMail(message);
      console.log(`Password reset email sent to ${user.email}`);
      return result;
    } catch (error) {
      console.error(`Failed to send password reset email to ${user.email}:`, error);
      throw new Error('Failed to send password reset email');
    }
  }
}

export default new EmailService();