import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  updateProfile, 
  changePassword, 
  uploadProfileImage, 
  deleteAccount, 
  getCurrentUser
} from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUserProfile: (data: { name?: string; email?: string }) => Promise<void>;
  changeUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  uploadUserProfileImage: (file: File) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Try to fetch the latest user data from the backend
      getCurrentUser()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('plantCareUser', JSON.stringify(userData));
        })
        .catch((err) => {
          // If error, fallback to localStorage or logout
    const storedUser = localStorage.getItem('plantCareUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
              setUser(null);
        localStorage.removeItem('plantCareUser');
      }
          } else {
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
    setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await loginUser(email, password);
      
      // After login, fetch the complete user data including profile image
      const completeUserData = await getCurrentUser();
      setUser(completeUserData);
      localStorage.setItem('plantCareUser', JSON.stringify(completeUserData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await registerUser(name, email, password);
      
      // After registration, fetch the complete user data including profile image
      const completeUserData = await getCurrentUser();
      setUser(completeUserData);
      localStorage.setItem('plantCareUser', JSON.stringify(completeUserData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      localStorage.removeItem('plantCareUser');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: { name?: string; email?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem('plantCareUser', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await changePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadUserProfileImage = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await uploadProfileImage(file);
      setUser(updatedUser);
      localStorage.setItem('plantCareUser', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload profile image');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUserAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteAccount();
      setUser(null);
      localStorage.removeItem('plantCareUser');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    updateUserProfile,
    changeUserPassword,
    uploadUserProfileImage,
    deleteUserAccount
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}