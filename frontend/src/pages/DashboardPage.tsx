"use client"

import type React from "react"
import { useState, useEffect, useId, startTransition } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import BasicStats from "../components/Dashboard/BasicStats"
import { getUserPlants, type Plant, deletePlant, updatePlant } from "../services/plantService"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import {
  Plus,
  Droplets,
  Trash2,
  ArrowLeft,
  Leaf,
  Sun,
  CloudRain,
  Heart,
  Calendar,
  Sparkles,
  Star,
  Zap,
  TreePine,
  Waves,
  Flower2,
  Sprout,
} from "lucide-react"
import { toast } from "react-hot-toast"

// Floating green particles component
function FloatingGreenParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${
            i % 4 === 0
              ? "bg-emerald-400/40"
              : i % 4 === 1
                ? "bg-green-400/40"
                : i % 4 === 2
                  ? "bg-lime-400/40"
                  : "bg-teal-400/40"
          }`}
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * -150, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Plant Card with perfect green theme
function PlantCard({
  plant,
  onClick,
  onWater,
  onDelete,
}: {
  plant: Plant
  onClick: () => void
  onWater: () => void
  onDelete: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const cardId = useId()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-100, 100], [8, -8])
  const rotateY = useTransform(mouseX, [-100, 100], [-8, 8])

  const springConfig = { damping: 30, stiffness: 400 }
  const x = useSpring(rotateX, springConfig)
  const y = useSpring(rotateY, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  const handleWaterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Water button clicked');
    
    // Ensure the click event is being handled
    try {
      // Call the onWater function directly without startTransition
      onWater();
    } catch (error) {
      console.error('Error in water button click handler:', error);
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    startTransition(() => {
      onDelete()
    })
  }

  const getHealthGradient = (status: string) => {
    switch (status) {
      case "healthy":
        return "from-emerald-500/30 via-green-400/20 to-teal-500/30"
      case "warning":
        return "from-lime-500/30 via-yellow-400/20 to-green-400/30"
      default:
        return "from-red-500/20 via-rose-400/15 to-green-400/20"
    }
  }

  const getHealthColors = (status: string) => {
    switch (status) {
      case "healthy":
        return {
          bg: "bg-emerald-500/95",
          text: "text-white",
          border: "border-emerald-400/60",
        }
      case "warning":
        return {
          bg: "bg-lime-500/95",
          text: "text-green-900",
          border: "border-lime-400/60",
        }
      default:
        return {
          bg: "bg-red-500/95",
          text: "text-white",
          border: "border-red-400/60",
        }
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <Star className="h-4 w-4" />
      case "warning":
        return <Zap className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
  }

  const healthColors = getHealthColors(plant.healthStatus)

  // Construct the image URL properly
  const imageUrl = plant.imagePath 
    ? `${process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : ''}/uploads/${plant.imagePath}` 
    : "/placeholder.svg?height=200&width=300";
  
  // Check if plant has been watered
  const isWatered = !!plant.lastWatered;

  return (
    <motion.div
      style={{ rotateX: x, rotateY: y, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      className="group cursor-pointer perspective-1000"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-labelledby={`plant-${cardId}`}
    >
      <div className="relative">
        {/* Perfect glassmorphism card with green theme */}
        <motion.div
          className="relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-green-200/30 dark:border-green-700/30 overflow-hidden"
          animate={{
            boxShadow: hovered
              ? "0 30px 60px -12px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(34, 197, 94, 0.2)"
              : "0 15px 35px -5px rgba(34, 197, 94, 0.15), 0 5px 15px -3px rgba(34, 197, 94, 0.1)",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Animated green gradient overlay */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${getHealthGradient(plant.healthStatus)} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
            animate={{
              background: hovered
                ? `linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(5, 150, 105, 0.15) 100%)`
                : undefined,
            }}
          />

          {/* Floating green sparkles */}
          <AnimatePresence>
            {hovered && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0],
                      rotate: [0, 180, 360],
                      x: Math.random() * 250 - 125,
                      y: Math.random() * 250 - 125,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 2.5,
                      delay: i * 0.15,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute top-1/2 left-1/2 w-2 h-2"
                  >
                    <Sparkles className="h-2 w-2 text-emerald-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Image section with enhanced green effects */}
          <div className="relative h-56 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: hovered ? 1.12 : 1,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img
                src={imageUrl}
                alt={plant.species || "Plant"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>

            {/* Multi-layer green gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/25 via-transparent to-green-500/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/20 via-transparent to-lime-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Action buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
              <button
                onClick={handleWaterClick}
                className={`${
                  isWatered 
                    ? 'bg-blue-600 hover:bg-blue-700 ring-4 ring-blue-300/50' 
                    : 'bg-blue-400/80 hover:bg-blue-500'
                } text-white rounded-full p-2 shadow-lg transform transition-all duration-300 hover:scale-110`}
                aria-label={isWatered ? "Plant watered" : "Water plant"}
                title={isWatered ? "Mark as not watered" : "Mark as watered"}
              >
                <Droplets className={`h-5 w-5 ${isWatered ? 'animate-pulse' : ''}`} />
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transform transition-transform hover:scale-110"
                aria-label="Delete plant"
                title="Delete plant"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content section with enhanced styling */}
          <div className="p-5 relative z-10">
            <h3
              id={`plant-${cardId}`}
              className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-1 truncate"
            >
              {plant.species || "Unknown Plant"}
            </h3>

            <div className="flex items-center justify-between mb-3">
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full ${healthColors.bg} ${healthColors.text} text-xs font-medium`}
              >
                {getHealthIcon(plant.healthStatus)}
                <span className="ml-1 capitalize">
                  {plant.healthStatus}
                  {plant.diseaseName && plant.healthStatus === "unhealthy" && `: ${plant.diseaseName}`}
                </span>
              </div>
              
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                isWatered 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {isWatered ? '💧 Watered' : '⚠️ Needs water'}
              </div>
            </div>

            {plant.recommendations && plant.recommendations.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wide">
                  Care Tips:
                </p>
                <ul className="text-sm text-neutral-600 dark:text-neutral-300 list-disc list-inside space-y-1">
                  {plant.recommendations.slice(0, 2).map((tip, i) => (
                    <li key={i} className="truncate">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const componentId = useId()

  useEffect(() => {
    const loadPlants = async () => {
      setLoading(true);
      try {
        const fetchedPlants = await getUserPlants();
        console.log('Fetched plants:', fetchedPlants);
        setPlants(fetchedPlants);
      } catch (error) {
        console.error('Error loading plants:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPlants()
  }, [])

  const handlePlantSelect = (plant: Plant) => {
    startTransition(() => {
      setSelectedPlant(plant)
      setIsDetailsOpen(true)
    })
  }

  const handlePlantDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await deletePlant(id)
        startTransition(() => {
          setPlants(plants.filter((plant) => plant.id !== id))
          if (selectedPlant?.id === id) {
            setSelectedPlant(null)
            setIsDetailsOpen(false)
          }
        })
      } catch (error) {
        console.error("Error deleting plant:", error)
      }
    }
  }

  const handleWaterPlant = async (id: string) => {
    try {
      const plant = plants.find(p => p.id === id);
      if (!plant) return;
      
      // Toggle watering status
      const newLastWatered = plant.lastWatered ? null : new Date().toISOString();
      
      console.log(`${plant.lastWatered ? 'Unwatering' : 'Watering'} plant ${id}`);
      console.log('Current lastWatered:', plant.lastWatered);
      console.log('New lastWatered:', newLastWatered);
      
      // Set default water frequency to 1 day if not set
      const waterFrequency = plant.waterFrequency || 1;
      
      // Create a copy of the plant with updated values for better debugging
      const plantToUpdate = { 
        lastWatered: newLastWatered,
        waterFrequency 
      };
      
      console.log('Sending update with data:', plantToUpdate);
      
      const updatedPlant = await updatePlant(id, plantToUpdate);
      console.log('Updated plant response:', updatedPlant);

      // Update the plants list with the updated plant
      setPlants(prevPlants => prevPlants.map((p) => (p.id === id ? updatedPlant : p)));

      // If the selected plant is the one being watered, update it too
      if (selectedPlant?.id === id) {
        setSelectedPlant(updatedPlant);
      }
      
      // Show success message
      toast.success(plant.lastWatered ? 'Plant marked as not watered' : 'Plant watered successfully!');
    } catch (error) {
      console.error("Error updating watering status:", error);
      toast.error("Failed to update watering status: " + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleAddPlant = () => {
    startTransition(() => {
      navigate("/analysis")
    })
  }

  const handleCloseDetails = () => {
    startTransition(() => {
      setIsDetailsOpen(false)
    })
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-neutral-900 dark:via-green-950 dark:to-emerald-950 relative overflow-hidden">
        {/* Perfect green animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-lime-400/20 to-green-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
          />
        </div>

        <FloatingGreenParticles />

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-160px)]">
          <div className="flex flex-col items-center space-y-10">
            <div className="relative">
              {/* Perfect green multi-layer loading animation */}
              <motion.div
                className="w-28 h-28 border-4 border-emerald-200/60 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 w-28 h-28 border-4 border-t-emerald-500 border-r-green-500 border-b-teal-500 border-l-lime-500 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 w-24 h-24 border-4 border-t-transparent border-r-emerald-400 border-b-transparent border-l-green-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 w-20 h-20 border-4 border-t-teal-400 border-r-transparent border-b-lime-400 border-l-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {/* Perfect center icon with green pulsing effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="p-4 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-full shadow-2xl"
                >
                  <motion.div
                    animate={{
                      rotate: [0, -180, -360],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <TreePine className="h-8 w-8 text-white" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Floating green sparkles around loader */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, Math.cos((i * Math.PI * 2) / 6) * 60],
                    y: [0, Math.sin((i * Math.PI * 2) / 6) * 60],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                >
                  <Sparkles className="h-2 w-2 text-emerald-400" />
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center space-y-4"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Growing Your Garden...
              </h3>
              <p className="text-green-700 dark:text-green-300 text-lg font-medium">
                Nurturing your digital plant paradise
              </p>
              <motion.div
                className="flex items-center justify-center space-x-2 mt-4"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Sprout className="h-5 w-5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Loading plants...</span>
                <Leaf className="h-5 w-5 text-green-500" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-160px)] relative overflow-hidden">
      {/* Perfect green background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-green-50/80 to-teal-50/90 dark:from-neutral-900 dark:via-green-950 dark:to-emerald-950" />

      {/* Perfect animated green background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-[500px] h-[500px] bg-gradient-to-r from-emerald-400/15 via-green-400/15 to-teal-400/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute top-40 right-20 w-[600px] h-[600px] bg-gradient-to-r from-lime-400/15 via-emerald-400/15 to-green-400/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-r from-teal-400/15 via-emerald-400/15 to-lime-400/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            rotate: [0, -180, -360],
          }}
          transition={{ duration: 35, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <FloatingGreenParticles />

      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Perfect green header */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10"
          >
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <motion.div
                  className="relative p-5 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-[2rem] shadow-2xl"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-[2rem]" />
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <TreePine className="h-12 w-12 text-white relative z-10" />
                  </motion.div>

                  {/* Perfect floating green sparkles around icon */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-emerald-300 rounded-full"
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, Math.cos((i * Math.PI * 2) / 6) * 30],
                        y: [0, Math.sin((i * Math.PI * 2) / 6) * 30],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.5,
                      }}
                      style={{
                        top: "50%",
                        left: "50%",
                      }}
                    />
                  ))}
                </motion.div>

                <div>
                  <motion.h1
                    className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent leading-tight"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    Plant Paradise
                  </motion.h1>
                  <motion.div
                    className="flex items-center space-x-3 mt-3"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Waves className="h-6 w-6 text-teal-500" />
                    </motion.div>
                    <p className="text-2xl text-green-700 dark:text-green-300 font-bold">
                      Welcome back,{" "}
                      <span className="font-black text-emerald-600 dark:text-emerald-400">{user?.name}</span>!
                    </p>
                  </motion.div>
                  <motion.p
                    className="text-green-600 dark:text-green-400 mt-2 text-lg font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Your flourishing digital garden ecosystem awaits
                  </motion.p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{
                scale: 1.06,
                y: -8,
                boxShadow: "0 30px 60px -12px rgba(34, 197, 94, 0.5)",
              }}
              whileTap={{ scale: 0.94 }}
              onClick={handleAddPlant}
              className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white rounded-[2rem] shadow-2xl overflow-hidden"
              aria-label="Add new plant to collection"
            >
              {/* Perfect animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" />

              {/* Perfect shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 4,
                }}
              />

              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="mr-4 relative z-10"
              >
                <Plus className="h-7 w-7" />
              </motion.div>
              <span className="font-black text-xl relative z-10">Add New Plant</span>

              {/* Perfect floating green particles */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-emerald-200 rounded-full opacity-0 group-hover:opacity-100"
                  animate={{
                    y: [0, -30, 0],
                    x: [0, Math.random() * 30 - 15, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3,
                  }}
                  style={{
                    top: "50%",
                    left: `${25 + i * 20}%`,
                  }}
                />
              ))}
            </motion.button>
          </motion.div>

          {/* Perfect green stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mb-20"
          >
            <BasicStats plants={plants} />
          </motion.div>

          {/* Perfect green plants grid */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.2 }}>
            <div className="flex items-center justify-between mb-12">
              <motion.h2
                className="text-4xl font-black text-green-800 dark:text-green-200 flex items-center space-x-5"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Flower2 className="h-10 w-10 text-emerald-500" />
                </motion.div>
                <span>Your Green Collection</span>
                <motion.span
                  className="text-xl font-bold text-green-600 dark:text-green-400"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  ({plants.length} plants)
                </motion.span>
              </motion.h2>
            </div>

            {plants.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24"
              >
                <div className="max-w-lg mx-auto">
                  <motion.div
                    className="w-40 h-40 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-10 relative overflow-hidden"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-teal-400/20 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <TreePine className="h-20 w-20 text-emerald-500 relative z-10" />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-3xl font-black text-green-800 dark:text-green-200 mb-4">
                    Your green sanctuary awaits
                  </h3>
                  <p className="text-green-600 dark:text-green-400 mb-10 text-xl font-medium">
                    Begin your botanical journey !
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddPlant}
                    className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white rounded-[2rem] shadow-2xl transition-all duration-400 text-xl font-black"
                  >
                    <Plus className="h-7 w-7 mr-4" />
                    Plant Your First Seed
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {plants.map((plant, index) => (
                  <motion.div
                    key={plant.id}
                    initial={{ opacity: 0, y: 60, rotateX: -25 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: 1.2 + index * 0.2,
                      duration: 1,
                      ease: "easeOut",
                    }}
                  >
                    <PlantCard
                      plant={plant}
                      onClick={() => handlePlantSelect(plant)}
                      onWater={() => handleWaterPlant(plant.id)}
                      onDelete={() => handlePlantDelete(plant.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Perfect green plant details drawer */}
      <AnimatePresence mode="wait">
        {isDetailsOpen && selectedPlant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-end overflow-hidden"
            onClick={handleCloseDetails}
          >
            <motion.div
              initial={{ x: "100%", scale: 0.9 }}
              animate={{ x: 0, scale: 1 }}
              exit={{ x: "100%", scale: 0.9 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-2xl w-full max-w-md h-full overflow-y-auto shadow-2xl border-l border-green-200/40 dark:border-green-700/40"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby={`plant-details-${componentId}`}
              aria-modal="true"
            >
              {/* Perfect green sticky header */}
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-2xl border-b border-green-200/40 dark:border-green-700/40 p-7">
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -8 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseDetails}
                    className="p-4 rounded-2xl bg-green-50/80 dark:bg-green-900/30 hover:bg-green-100/80 dark:hover:bg-green-800/40 backdrop-blur-sm transition-all duration-400 border border-green-200/50 dark:border-green-700/50"
                    aria-label="Close plant details"
                  >
                    <ArrowLeft className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </motion.button>
                  <h2
                    id={`plant-details-${componentId}`}
                    className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent"
                  >
                    Plant Details
                  </h2>
                  <div className="w-14"></div>
                </div>
              </div>

              <div className="p-7 space-y-10">
                {/* Perfect green hero section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl"
                >
                  <img
                    src={selectedPlant.imagePath 
                      ? `${process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : ''}/uploads/${selectedPlant.imagePath}` 
                      : "/placeholder.svg?height=300&width=400"}
                    alt={selectedPlant.name || selectedPlant.species}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Perfect green multi-layer overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-transparent to-green-500/30" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/25 via-transparent to-lime-500/25" />

                  {/* Perfect floating content */}
                  <motion.div
                    className="absolute bottom-7 left-7 right-7 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-3xl font-black mb-2 drop-shadow-lg">{selectedPlant.name || selectedPlant.species}</h3>
                    <p className="text-white/95 italic text-xl drop-shadow font-medium">{selectedPlant.species}</p>
                    {selectedPlant.diseaseName && selectedPlant.healthStatus === "unhealthy" && (
                      <p className="text-red-300 font-medium mt-2 bg-red-900/50 inline-block px-3 py-1 rounded-lg">
                        Disease: {selectedPlant.diseaseName}
                      </p>
                    )}
                  </motion.div>

                  {/* Perfect decorative elements */}
                  <div className="absolute top-6 right-6">
                    <motion.div
                      className="w-14 h-14 bg-white/25 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Sparkles className="h-7 w-7 text-emerald-200" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Perfect green enhanced info grid */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-5"
                >
                  {[
                    {
                      label: "Water Frequency",
                      value: `Every ${selectedPlant.waterFrequency} days`,
                      icon: Droplets,
                      gradient: "from-emerald-500/25 to-teal-500/25",
                      iconColor: "text-emerald-600 dark:text-emerald-400",
                      textColor: "text-emerald-700 dark:text-emerald-300",
                      border: "border-emerald-200/60 dark:border-emerald-700/60",
                    },
                    {
                      label: "Last Watered",
                      value: selectedPlant.lastWatered
                        ? new Date(selectedPlant.lastWatered).toLocaleDateString()
                        : "Not recorded",
                      icon: Calendar,
                      gradient: "from-green-500/25 to-lime-500/25",
                      iconColor: "text-green-600 dark:text-green-400",
                      textColor: "text-green-700 dark:text-green-300",
                      border: "border-green-200/60 dark:border-green-700/60",
                    },
                    {
                      label: "Sunlight Needs",
                      value: selectedPlant.sunlight,
                      icon: Sun,
                      gradient: "from-lime-500/25 to-yellow-500/25",
                      iconColor: "text-lime-600 dark:text-lime-400",
                      textColor: "text-lime-700 dark:text-lime-300",
                      border: "border-lime-200/60 dark:border-lime-700/60",
                    },
                    {
                      label: "Humidity Needs",
                      value: selectedPlant.humidity,
                      icon: CloudRain,
                      gradient: "from-teal-500/25 to-cyan-500/25",
                      iconColor: "text-teal-600 dark:text-teal-400",
                      textColor: "text-teal-700 dark:text-teal-300",
                      border: "border-teal-200/60 dark:border-teal-700/60",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 30, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ delay: 0.5 + index * 0.15 }}
                      whileHover={{ scale: 1.03, y: -3 }}
                      className={`p-6 rounded-[1.5rem] border bg-gradient-to-br ${item.gradient} ${item.border} backdrop-blur-sm relative overflow-hidden`}
                    >
                      {/* Perfect decorative background element */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/15 rounded-full transform translate-x-10 -translate-y-10" />

                      <div className="flex items-center space-x-4 mb-4 relative z-10">
                        <motion.div
                          className="p-3 bg-white/25 dark:bg-neutral-800/25 rounded-2xl backdrop-blur-sm border border-white/30"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                        >
                          <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                        </motion.div>
                        <p className={`text-sm font-bold ${item.textColor}`}>{item.label}</p>
                      </div>
                      <p className="font-black text-neutral-900 dark:text-neutral-100 capitalize relative z-10 text-xl">
                        {item.value}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Perfect green health status */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                  <h4 className="font-black text-green-800 dark:text-green-200 mb-5 flex items-center space-x-4 text-xl">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Heart className="h-7 w-7 text-red-500" />
                    </motion.div>
                    <span>Health Status</span>
                  </h4>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-7 rounded-[1.5rem] border backdrop-blur-sm relative overflow-hidden ${
                      selectedPlant.healthStatus === "healthy"
                        ? "bg-gradient-to-br from-emerald-500/25 to-green-500/25 border-emerald-200/60 dark:border-emerald-800/60"
                        : selectedPlant.healthStatus === "warning"
                          ? "bg-gradient-to-br from-lime-500/25 to-yellow-500/25 border-lime-200/60 dark:border-lime-800/60"
                          : "bg-gradient-to-br from-red-500/25 to-pink-500/25 border-red-200/60 dark:border-red-800/60"
                    }`}
                  >
                    {/* Perfect animated background pulse */}
                    <motion.div
                      className={`absolute inset-0 opacity-20 ${
                        selectedPlant.healthStatus === "healthy"
                          ? "bg-emerald-400"
                          : selectedPlant.healthStatus === "warning"
                            ? "bg-lime-400"
                            : "bg-red-400"
                      }`}
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.1, 0.3, 0.1],
                      }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    />

                    <div className="flex items-center space-x-5 relative z-10">
                      <motion.div
                        className={`w-5 h-5 rounded-full ${
                          selectedPlant.healthStatus === "healthy"
                            ? "bg-emerald-500"
                            : selectedPlant.healthStatus === "warning"
                              ? "bg-lime-500"
                              : "bg-red-500"
                        }`}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      />
                      <div>
                        <p
                          className={`font-black capitalize text-2xl ${
                            selectedPlant.healthStatus === "healthy"
                              ? "text-emerald-700 dark:text-emerald-400"
                              : selectedPlant.healthStatus === "warning"
                                ? "text-lime-700 dark:text-lime-400"
                                : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {selectedPlant.healthStatus}
                        </p>
                        {selectedPlant.diseaseName && selectedPlant.healthStatus === "unhealthy" && (
                          <p className="text-red-600 dark:text-red-400 text-lg mt-1">
                            Disease: {selectedPlant.diseaseName}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Perfect green notes section */}
                {selectedPlant.notes && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <h4 className="font-black text-green-800 dark:text-green-200 mb-5 text-xl">Notes</h4>
                    <div className="p-6 bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-900/40 dark:to-emerald-900/40 rounded-[1.5rem] border border-green-200/60 dark:border-green-700/60 backdrop-blur-sm">
                      <p className="text-green-700 dark:text-green-300 leading-relaxed text-lg font-medium">
                        {selectedPlant.notes}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Perfect green action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex space-x-5 pt-7"
                >
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      y: -4,
                      boxShadow: "0 25px 50px rgba(34, 197, 94, 0.5)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleWaterPlant(selectedPlant.id)}
                    className="flex-1 py-5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center space-x-4 relative overflow-hidden group"
                    aria-label={`Record watering for ${selectedPlant.name}`}
                  >
                    {/* Perfect shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 5,
                      }}
                    />

                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      <Droplets className="h-7 w-7 relative z-10" />
                    </motion.div>
                    <span className="font-black text-xl relative z-10">Record Watering</span>
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      y: -4,
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handlePlantDelete(selectedPlant.id)}
                    className="py-5 px-7 bg-gradient-to-br from-red-50/90 to-red-100/90 hover:from-red-100/90 hover:to-red-200/90 text-red-600 dark:from-red-900/30 dark:to-red-800/30 dark:hover:from-red-900/50 dark:hover:to-red-800/50 dark:text-red-400 rounded-[1.5rem] border border-red-200/60 dark:border-red-800/60 backdrop-blur-sm transition-all duration-400 flex items-center justify-center relative overflow-hidden"
                    aria-label={`Delete ${selectedPlant.name}`}
                  >
                    <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                      <Trash2 className="h-7 w-7" />
                    </motion.div>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DashboardPage
