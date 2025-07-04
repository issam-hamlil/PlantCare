import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import { motion } from 'framer-motion';
import plantCareLogo from '../assets/PlantCare_logo.png';
import { Leaf, Star } from "lucide-react"
// Ensure Tailwind CSS is imported

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  // Check URL parameters for mode
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    } else if (mode === 'login') {
      setIsLogin(true);
    }
  }, [location.search]);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-[calc(100vh-160px)] bg-neutral-50 dark:bg-neutral-900 py-12">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row">
        {/* Left Column - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:pr-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-center"
            >
              <div className="flex items-center justify-center mb-4">
                <img
                src={plantCareLogo}
              alt="PlantCare"
              className="h-27 w-20 transition-transform duration-100 group-hover:scale-110"
                />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Join PlantCare'}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {isLogin 
                  ? 'Sign in to track and manage your plants'
                  : 'Create an account to start your plant care journey'
                }
              </p>
            </motion.div>
            
            {isLogin ? <Login /> : <Register />}
            
            <div className="mt-6 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg"
          alt="Beautiful indoor plants"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/60 to-teal-900/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">Live Monitoring</span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute top-1/4 right-6 space-y-3"
      >
        <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
          <div className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-white text-xs">Plants Tracked</p>
              <p className="text-white font-bold">81</p>
            </div>
          </div>
        </div>
        <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-white text-xs">Success Rate</p>
              <p className="text-white font-bold">91%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-end p-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-emerald-400/30">
            
            <span className="text-emerald-200 text-sm font-medium">
              {isLogin ? "PlantCare " : "Join the Community"}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-white text-4xl font-bold leading-tight">
            {isLogin ? (
              <>
                Track, Care & Watch
                <br />
                <span className="text-emerald-300">Them Flourish</span>
              </>
            ) : (
              <>
                Start Your
                <br />
                <span className="text-emerald-300">Plant Journey</span>
              </>
            )}
          </h2>

          {/* Description */}
          <p className="text-neutral-200 text-lg leading-relaxed max-w-md">
            {isLogin
              ? "Your AI-powered plant assistant provides personalized care recommendations, watering reminders, and health monitoring."
              : "Join thousands of plant enthusiasts who have transformed their homes into thriving green sanctuaries."}
          </p>

          {/* Features List */}
          <div className="space-y-3">
            {["Smart watering schedules", "Disease detection & treatment", "Growth tracking & analytics"].map(
              (feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-neutral-200 text-sm">{feature}</span>
                </motion.div>
              ),
            )}
          </div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center justify-between pt-6 border-t border-white/20"
          >
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                {["bg-emerald-500", "bg-teal-500", "bg-green-500", "bg-lime-500"].map((color, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white text-sm font-semibold border-2 border-white/20`}
                  >
                    {["I.EL", "K.L", "I.H", "+"][index]}
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold">120+ gardeners</p>
                <p className="text-neutral-300 text-sm">Growing together</p>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>

     
      

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: [0, 1, 0],
            y: [100, -20, -100],
            x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
          }}
          className="absolute bottom-0 w-2 h-2 bg-emerald-400/40 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
          }}
        />
      ))}
    </div>
      </div>
    </div>
  );
};

export default AuthPage;