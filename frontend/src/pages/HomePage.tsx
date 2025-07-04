"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { TreesIcon as Plant, Search, AlertCircle, Droplet, Sparkles, Star, Heart } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

import TestConnection from "../components/TestConnection"

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <TestConnection />
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 dark:from-emerald-900/40 dark:via-teal-900/30 dark:to-green-900/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isAuthenticated ? (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight mb-4">
                    Welcome back,{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-emerald-400/30 dark:after:bg-emerald-400/20 glow-text">
                      {user?.name || "Plant Lover"}
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 mb-8">
                    Continue caring for your plants and keep them thriving. Check your dashboard for updates or analyze a new plant.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/dashboard"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 hover:translate-y-[-2px] px-6 py-3 font-medium shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] text-center"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/analysis"
                      className="bg-white hover:bg-neutral-50 text-emerald-600 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-all duration-300 hover:translate-y-[-2px] px-6 py-3 font-medium shadow-lg hover:shadow-xl text-center dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-primary-400"
                    >
                      Analyze New Plant
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight mb-4">
                    Keep Your Plants{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-emerald-400/30 dark:after:bg-emerald-400/20 glow-text">
                      Healthy
                    </span>{" "}
                    and{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-emerald-400/30 dark:after:bg-emerald-400/20 glow-text">
                      Thriving
                    </span>
                  </h1>
                  <div className="relative">
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-lg md:text-xl text-neutral-700 dark:text-neutral-300 mb-8 pl-4 border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 py-3 pr-4 rounded-r-lg shadow-sm"
                    >
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Meet your personal plant care assistant</span> — 
                      an intelligent companion powered by AI that helps you identify species, diagnose diseases, 
                      schedule watering, and track growth to ensure your plants flourish year-round.
                    </motion.p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/auth"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 hover:translate-y-[-2px] px-6 py-3 font-medium shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.6)] text-center"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/analysis"
                      className="bg-white hover:bg-neutral-50 text-emerald-600 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-all duration-300 hover:translate-y-[-2px] px-6 py-3 font-medium shadow-lg hover:shadow-xl text-center dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-primary-400"
                    >
                      Try Plant Analysis
                    </Link>
                  </div>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative lg:pl-12 perspective-[1200px]"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transform-gpu hover:scale-[1.02] hover:rotate-y-3 transition-transform duration-500">
                <img
                  src="https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg"
                  alt="Plant care app"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-900/50"></div>
              </div>

              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-5 md:bottom-10 md:left-0 backdrop-blur-md bg-white/30 dark:bg-white/10 border border-white/20 dark:border-white/10 rounded-xl p-4 shadow-xl max-w-[260px] transition-all hover:scale-105"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Watering Reminder</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">3 plants need water today</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - White Theme with Enhanced Animations */}
      <section className="py-24 px-4 relative overflow-hidden bg-white dark:bg-neutral-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large Floating Orbs with Enhanced Movement */}
          <motion.div
            animate={{
              x: [0, 200, -100, 0],
              y: [0, -150, 100, 0],
              scale: [1, 1.5, 0.8, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl"
          ></motion.div>

          <motion.div
            animate={{
              x: [0, -200, 150, 0],
              y: [0, 120, -80, 0],
              scale: [1, 0.6, 1.3, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full blur-3xl"
          ></motion.div>

          <motion.div
            animate={{
              x: [0, 120, -80, 0],
              y: [0, -100, 150, 0],
              scale: [1, 1.2, 0.9, 1],
              rotate: [0, 270, 540],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl"
          ></motion.div>

          {/* Enhanced Floating Particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -200, 0],
                x: [0, Math.sin(i) * 100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
              className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full border-2 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-8 shadow-lg"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                </motion.div>
                Revolutionary AI-Powered Plant Care
              </motion.div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Smart Features for
                </motion.span>
                <br />
                <motion.span
                  animate={{
                    backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                 Plant Lovers
                </motion.span>
              </h2>

              <p className="text-xl text-gray-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Everything you need to become a better plant parent and create a thriving indoor garden.
              </p>
            </motion.div>
          </div>

          {/* Main Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Hero Feature Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-8 group"
            >
              <motion.div
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{ duration: 0.3 }}
                className="relative h-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 border-2 border-emerald-200 dark:border-emerald-800 overflow-hidden shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Enhanced Animated Border */}
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-emerald-300/30 via-transparent to-teal-300/30 rounded-3xl blur-xl"
                />

                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <motion.div
                      whileHover={{
                        rotate: [0, 360],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{ duration: 0.8 }}
                      animate={{
                        y: [0, -10, 0],
                      }}
                      className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mr-6 shadow-2xl shadow-emerald-500/25"
                    >
                      <Search className="w-10 h-10 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                       Plant Identification
                      </h3>
                      
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-white/90 text-xl leading-relaxed mb-8">
                 Simply snap a photo of any plant to instantly identify its species and receive detailed care instructions.
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center text-gray-600 dark:text-white/80"
                    >
                      <Star className="w-5 h-5 text-yellow-500 mr-3" />
                      <span>Technology meets nature</span>
                    </motion.div>
                    
                  </div>
                </div>

                {/* Enhanced Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-full blur-xl"
                />
              </motion.div>
            </motion.div>

            {/* Health Diagnosis Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-4 group"
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  rotateX: 10,
                }}
                transition={{ duration: 0.3 }}
                className="relative h-full bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-3xl p-6 border-2 border-red-200 dark:border-red-800 overflow-hidden shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-red-300/20 to-pink-300/20 rounded-3xl"
                />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{
                      scale: [1, 1.4, 1],
                      rotate: [0, 360],
                    }}
                    transition={{ duration: 0.8 }}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-red-500/25"
                  >
                    <AlertCircle className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Health Diagnosis</h3>
                  <p className="text-gray-600 dark:text-white/80 leading-relaxed mb-6">
                   Analyze leaf symptoms using AI to detect common plant diseases and nutrient deficiencies early.
                  </p>

                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center text-red-600 dark:text-red-400">
                    <Heart className="w-4 h-4 mr-2" />
                    <span className="text-sm">Predictive Health Analytics</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Droplet,
                title: "Watering Reminders",
                description: "Get personalized watering schedules and timely alerts so you never miss a watering day.",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
                borderColor: "border-blue-200",
                delay: 0.3,
              },
              {
                icon: Sparkles,
                title: "Personalized Tips",
                description: "Receive care advice tailored to your plant's species, age, health, and growing environment.",
                gradient: "from-purple-500 to-indigo-500",
                bgGradient: "from-purple-50 to-indigo-50",
                borderColor: "border-purple-200",
                delay: 0.4,
              },
              {
                icon: Plant,
                title: "Digital Garden",
                description: "Manage your entire plant collection in one place, with profiles and growth history for each plant.",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-50 to-emerald-50",
                borderColor: "border-green-200",
                delay: 0.5,
              },
              {
                icon: Star,
                title: "Care Journal",
                description: "Record your plant care activities, observations, and progress to discover what works best over time.",
                gradient: "from-orange-500 to-yellow-500",
                bgGradient: "from-orange-50 to-yellow-50",
                borderColor: "border-orange-200",
                delay: 0.6,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  whileHover={{
                    scale: 1.08,
                    rotateX: 15,
                    rotateY: 15,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`relative bg-gradient-to-br ${feature.bgGradient} dark:from-white/5 dark:to-white/10 rounded-2xl p-6 border-2 ${feature.borderColor} dark:border-white/10 hover:border-opacity-50 transition-all duration-500 overflow-hidden shadow-xl`}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 12,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-5 rounded-2xl blur-xl`}
                  />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 360],
                      }}
                      transition={{ duration: 0.8 }}
                      animate={{
                        y: [0, -5, 0],
                      }}
                      className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-2xl`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-white/70 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          
         
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to level up your plant care?</h2>
              <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
                Join thousands of plant enthusiasts who are growing healthier, happier plants with PlantCare.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/auth?mode=register"
                  className="bg-white hover:bg-neutral-50 text-emerald-700 font-semibold rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-emerald-700/20 hover:shadow-xl inline-block px-8 py-4"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/auth?mode=login"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-emerald-900/20 hover:shadow-xl inline-block px-8 py-4 border border-emerald-700"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
