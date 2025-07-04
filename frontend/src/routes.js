import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PlantProfilePage from './pages/PlantProfilePage';
import ImageUploadPage from './pages/ImageUploadPage';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: '/plant/:id',
    element: <ProtectedRoute><PlantProfilePage /></ProtectedRoute>,
  },
  {
    path: '/analysis',
    element: <ProtectedRoute><ImageUploadPage /></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><UserProfilePage /></ProtectedRoute>,
  },
]);