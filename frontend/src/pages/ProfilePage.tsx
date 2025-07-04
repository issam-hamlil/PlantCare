"use client"

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { getUserPlants } from "../services/plantService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Lock, 
  Bell, 
  Trash2, 
  Save, 
  LogOut, 
  Sprout as PlantIcon, 
  Settings, 
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Camera
} from "lucide-react";
import { toast } from "react-hot-toast";

const ProfilePage: React.FC = () => {
  const { user, logout, updateUserProfile, changeUserPassword, uploadUserProfileImage, deleteUserAccount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [plantCount, setPlantCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile form state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Privacy settings
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    shareData: false,
    darkMode: theme === 'dark'
  });

  useEffect(() => {
    if (user) {
      console.log('User data loaded:', user);
      setName(user.name || "");
      setEmail(user.email || "");
      
      // Fetch plant count
      const fetchPlantCount = async () => {
        try {
          const plants = await getUserPlants();
          setPlantCount(plants.length);
        } catch (error) {
          console.error("Error fetching plants:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPlantCount();
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Update dark mode setting when theme changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }));
  }, [theme]);

  const handleSettingChange = (setting: keyof typeof settings) => {
    if (setting === 'darkMode') {
      console.log('Toggling dark mode from ProfilePage');
      toggleTheme();
      // The state will be updated by the useEffect that watches theme changes
    } else {
      setSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
      
      // Show toast for other settings
      const settingName = setting === 'emailNotifications' ? 'Email notifications' : 
                         setting === 'pushNotifications' ? 'Push notifications' : 
                         'Data sharing';
      
      const newValue = !settings[setting];
      toast.success(`${settingName} ${newValue ? 'enabled' : 'disabled'}`);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setSaving(true);
    
    try {
      console.log('Updating profile with name:', name, 'and email:', email);
      await updateUserProfile({ name, email });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    setSaving(true);
    
    try {
      console.log('Changing password');
      await changeUserPassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteUserAccount();
        navigate("/");
        toast.success("Account deleted successfully");
      } catch (error) {
        toast.error("Failed to delete account");
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Only image files are allowed");
        return;
      }
      
      try {
        setSaving(true);
        console.log('Uploading profile image:', file.name, file.type, file.size);
        await uploadUserProfileImage(file);
        toast.success("Profile image updated successfully!");
      } catch (error) {
        console.error("Error uploading profile image:", error);
        toast.error("Failed to upload profile image: " + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setSaving(false);
        
        // Reset the file input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const getProfileImageUrl = () => {
    if (user?.profileImage) {
      // If it's a full URL (from mock data)
      if (user.profileImage.startsWith('http')) {
        return user.profileImage;
      }
      // Otherwise construct the URL with the backend path
      console.log('Profile image path:', user.profileImage);
      // Use relative path to benefit from the proxy setup in vite.config.ts
      return `/uploads/profiles/${user.profileImage}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-emerald-950 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
            <User className="h-8 w-8 mr-3 text-emerald-600 dark:text-emerald-400" />
            My Profile
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left sidebar with user info */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col items-center mb-6">
                  <div 
                    className="w-24 h-24 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 relative group cursor-pointer"
                    onClick={handleProfileImageClick}
                  >
                    {user?.profileImage ? (
                      <img 
                        src={getProfileImageUrl() || undefined} 
                        alt={user.name || 'Profile'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12" />
                    )}
                    
                    {/* Overlay with camera icon on hover */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Hidden file input */}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{email}</p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <PlantIcon className="h-5 w-5 text-emerald-500 mr-2" />
                      <span>Plants</span>
                    </div>
                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {plantCount}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Bell className="h-5 w-5 text-emerald-500 mr-2" />
                      <span>Notifications</span>
                    </div>
                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      3
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => logout().then(() => navigate("/"))}
                    className="w-full flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 font-medium rounded-lg px-4 py-2.5 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Right content area with tabs */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                    Personal Information
                  </h3>
                  
                  <form onSubmit={handleSaveProfile}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-700 dark:text-white"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-700 dark:text-white"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-4 py-2.5 transition-colors"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                    Change Password
                  </h3>
                  
                  <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-700 dark:text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-700 dark:text-white"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-neutral-700 dark:text-white"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                      className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg px-4 py-2.5 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                    Privacy Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-gray-800 dark:text-white font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive watering reminders and plant health alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.emailNotifications} 
                          onChange={() => handleSettingChange('emailNotifications')} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-gray-800 dark:text-white font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications on your device</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.pushNotifications} 
                          onChange={() => handleSettingChange('pushNotifications')} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-gray-800 dark:text-white font-medium">Share Plant Data</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Help improve plant identification by sharing anonymous data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.shareData} 
                          onChange={() => handleSettingChange('shareData')} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-gray-800 dark:text-white font-medium">Dark Mode</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={settings.darkMode} 
                          onChange={() => handleSettingChange('darkMode')} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Danger Zone
                  </h3>
                  
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2.5 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage; 