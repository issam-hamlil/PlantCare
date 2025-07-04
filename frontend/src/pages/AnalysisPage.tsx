"use client"

import type React from "react"
import { useState } from "react"
import ImageUpload from "../components/PlantAnalysis/ImageUpload"
import Result from "../components/PlantAnalysis/Result"
import { analyzePlantImage, saveAnalyzedPlant } from "../services/plantService"
import { motion } from "framer-motion"
import { Search, ArrowLeft,  Sparkles, Play } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

interface AnalysisResult {
  species: string
  healthStatus: "healthy" | "warning" | "unhealthy"
  diseaseName?: string
  recommendations: string[]
}

const AnalysisPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const navigate = useNavigate()

  const handleImageUpload = async (file: File) => {
    // Reset previous results first
    setResult(null);
    setSelectedImage(file);
    // Start analysis automatically when image is uploaded
    await handleAnalyze(file);
  }

  const handleAnalyze = async (file?: File) => {
    const imageToAnalyze = file || selectedImage;
    if (!imageToAnalyze) return;

    setIsAnalyzing(true);
    setResult(null); // Clear any previous results
    
    try {
      const analysisResult = await analyzePlantImage(imageToAnalyze);
      console.log("New analysis result received:", analysisResult);
      setResult(analysisResult);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const handleSavePlant = async () => {
    if (!selectedImage || !result) return;
    
    setIsSaving(true);
    try {
      await saveAnalyzedPlant(result, selectedImage);
      toast.success("Plant saved to your dashboard!");
      // Navigate to dashboard after successful save
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving plant:", error);
      toast.error("Failed to save plant. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  }

  return (
    <div className="min-h-[calc(100vh-160px)] relative overflow-hidden">
      {/* Background dynamique avec animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 dark:from-green-950 dark:via-emerald-950/50 dark:to-teal-950/30">
        {/* Formes géométriques animées */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-green-200/20 to-emerald-200/20 dark:from-green-800/10 dark:to-emerald-800/10 rounded-full blur-xl"
        />

        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/3 right-32 w-24 h-24 bg-gradient-to-r from-white/40 to-green-100/30 dark:from-green-900/20 dark:to-emerald-900/10 rounded-full blur-2xl"
        />

        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-100/30 to-teal-100/20 dark:from-emerald-800/10 dark:to-teal-800/5 rounded-full blur-3xl"
        />

        {/* Particules flottantes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
            className={`absolute w-2 h-2 bg-green-400/40 dark:bg-green-500/20 rounded-full blur-sm`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-green-50/40 dark:from-green-950/80 dark:via-transparent dark:to-emerald-950/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <Link
                to="/"
                className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mb-4 transition-all duration-300 group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Back to Home</span>
              </Link>

              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg"
                >
                
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Plant Analysis
                  </h1>
                  
                </div>
              </div>

              <p className="text-green-700 dark:text-green-300 mt-2 text-lg">
                Upload a photo of your plant to identify its species and get health insights
              </p>
            </div>

            {selectedImage && !result && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-6 py-3 bg-white/90 dark:bg-green-900/50 backdrop-blur-sm border border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/70 text-green-800 dark:text-green-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Upload Different Image
              </motion.button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 dark:bg-green-950/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-100/50 dark:border-green-800/30 overflow-hidden relative"
          >
            {/* Decorative border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/95 dark:bg-green-950/90 backdrop-blur-xl rounded-2xl">
              {!selectedImage || !result ? (
                <div className="p-8">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="text-center mb-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 mb-6 shadow-lg"
                      >
                        <Search className="h-10 w-10 text-green-600 dark:text-green-400" />
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent mb-3"
                      >
                        Plant Identification & Health Check
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-green-600 dark:text-green-400 max-w-2xl mx-auto text-lg leading-relaxed"
                      >
                        Upload a clear photo of your plant and our AI will identify its species, assess its health, and
                        provide care recommendations.
                      </motion.p>

                      {/* Feature highlights */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-4 mt-6"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100/60 dark:bg-green-900/40 rounded-full backdrop-blur-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-green-700 dark:text-green-300 font-medium">Species ID</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100/60 dark:bg-emerald-900/40 rounded-full backdrop-blur-sm">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                            Health Check
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-teal-100/60 dark:bg-teal-900/40 rounded-full backdrop-blur-sm">
                          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-teal-700 dark:text-teal-300 font-medium">Care Tips</span>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-6"
                    >
                      <ImageUpload onUpload={handleImageUpload} isAnalyzing={isAnalyzing} />

                      {/* Bouton Analyser */}
                      {selectedImage && !isAnalyzing && !result && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                          className="text-center"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnalyze()}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                          >
                            {/* Effet de brillance */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                            <Play className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                            <span>analyse</span>
                            <Sparkles className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                          </motion.button>

                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-green-600 dark:text-green-400 text-sm mt-3"
                          >
                           Click to start the analysis of your plant
                          </motion.p>
                        </motion.div>
                      )}

                      {/* État d'analyse */}
                      {isAnalyzing && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-8"
                        >
                          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                            <span className="text-green-700 dark:text-green-300 font-medium">Analysis in progress...</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              ) : (
                <div className="p-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Result 
                      result={result} 
                      onReset={handleReset} 
                      onSave={handleSavePlant}
                      isSaving={isSaving}
                    />
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Bottom decorative section */}
          {!selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-12 text-center"
            >
              
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage
