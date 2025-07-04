import api, { USE_MOCK_DATA } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
}

interface AuthResponse {
  user: User;
  token: string;
}

// For initial development, we'll use mock data
const mockUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    profileImage: null
  }
];

let mockToken = 'mock-jwt-token';

export async function loginUser(email: string, password: string): Promise<User> {
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          localStorage.setItem('token', mockToken);
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  }
  
  // Real API call
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to login. Please try again.');
    }
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers.some(u => u.email === email)) {
          reject(new Error('Email already registered'));
          return;
        }
        
        const newUser = {
          id: (mockUsers.length + 1).toString(),
          name,
          email,
          password,
          profileImage: null
        };
        
        mockUsers.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        localStorage.setItem('token', mockToken);
        resolve(userWithoutPassword);
      }, 500);
    });
  }
  
  // Real API call
  try {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function updateProfile(userData: { name?: string; email?: string }): Promise<User> {
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedUser = localStorage.getItem('plantCareUser');
        if (!storedUser) {
          reject(new Error('User not found'));
          return;
        }
        
        const currentUser = JSON.parse(storedUser);
        const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1) {
          reject(new Error('User not found'));
          return;
        }
        
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...userData
        };
        
        const { password, ...updatedUser } = mockUsers[userIndex];
        localStorage.setItem('plantCareUser', JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 500);
    });
  }
  
  // Real API call
  try {
    console.log('Updating profile with data:', userData);
    
    // Using direct JSON format for better compatibility
    const response = await api.put('/auth/profile', userData);
    console.log('Update profile response:', response);
    
    // Check the response structure and extract the user data
    let updatedUser;
    if (response.data.data && response.data.data.user) {
      updatedUser = response.data.data.user;
    } else if (response.data.user) {
      updatedUser = response.data.user;
    } else {
      throw new Error('Invalid response format from server');
    }
    
    localStorage.setItem('plantCareUser', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error: any) {
    console.error('Update profile error:', error);
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to update profile. Please try again.');
    }
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedUser = localStorage.getItem('plantCareUser');
        if (!storedUser) {
          reject(new Error('User not found'));
          return;
        }
        
        const currentUser = JSON.parse(storedUser);
        const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
        
        if (userIndex === -1 || mockUsers[userIndex].password !== currentPassword) {
          reject(new Error('Current password is incorrect'));
          return;
        }
        
        mockUsers[userIndex].password = newPassword;
        resolve();
      }, 500);
    });
  }
  
  // Real API call
  try {
    console.log('Changing password');
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    console.log('Change password response:', response);
    return;
  } catch (error: any) {
    console.error('Change password error:', error);
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      } else if (error.response.data.error) {
        throw new Error(error.response.data.error);
      }
    }
    throw new Error('Failed to change password. Please try again.');
  }
}

export async function uploadProfileImage(file: File): Promise<User> {
  try {
    console.log('Uploading profile image to API:', file.name, file.type, file.size);
    const formData = new FormData();
    formData.append('profileImage', file);
    
    console.log('API baseURL:', api.defaults.baseURL);
    
    const response = await api.post('/auth/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Profile image upload response:', response);
    
    const updatedUser = response.data.data.user;
    localStorage.setItem('plantCareUser', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error('Upload profile image error:', error);
    throw error;
  }
}

export async function deleteAccount(): Promise<void> {
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedUser = localStorage.getItem('plantCareUser');
        if (storedUser) {
          const currentUser = JSON.parse(storedUser);
          const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
          
          if (userIndex !== -1) {
            mockUsers.splice(userIndex, 1);
          }
          
          localStorage.removeItem('token');
          localStorage.removeItem('plantCareUser');
        }
        resolve();
      }, 500);
    });
  }
  
  // Real API call
  try {
    await api.delete('/users');
    localStorage.removeItem('token');
    localStorage.removeItem('plantCareUser');
    return;
  } catch (error) {
    console.error('Delete account error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  // Use mock data if flag is set to true
  if (USE_MOCK_DATA) {
    localStorage.removeItem('token');
    localStorage.removeItem('plantCareUser');
    return Promise.resolve();
  }
  
  // Real API call
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('plantCareUser');
    return;
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove the token even if the API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('plantCareUser');
    // Don't throw the error - allow logout to succeed even if API fails
    return;
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get('/auth/me');
    // Adjust according to your backend response structure
    if (response.data.data) {
      // If backend returns { data: { ...userFields } }
      return response.data.data;
    } else if (response.data.user) {
      // If backend returns { user: { ...userFields } }
      return response.data.user;
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('getCurrentUser error:', error);
    throw error;
  }
}