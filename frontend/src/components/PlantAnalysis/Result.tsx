"use client"

import type React from "react"
import { motion } from "framer-motion"
import { TreesIcon as Plant, Droplet, AlertTriangle, Sun, Thermometer, Save, Loader2 } from "lucide-react"

interface AnalysisResult {
  species: string
  healthStatus: "healthy" | "warning" | "unhealthy"
  diseaseName?: string
  recommendations: string[]
}

interface ResultProps {
  result: AnalysisResult | null
  onSave?: () => void
  onReset: () => void
  isSaving?: boolean
}

const Result: React.FC<ResultProps> = ({ result, onSave, onReset, isSaving = false }) => {
  if (!result) return null

  const getHealthStatusColor = (status: "healthy" | "warning" | "unhealthy") => {
    switch (status) {
      case "healthy":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
      case "unhealthy":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
    }
  }

  const getHealthStatusIcon = (status: "healthy" | "warning" | "unhealthy") => {
    switch (status) {
      case "healthy":
        return <div className="w-4 h-4 rounded-full bg-green-500"></div>
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "unhealthy":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
          <Plant className="h-8 w-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Analysis Results</h2>
        <p className="text-neutral-600 dark:text-neutral-400">Here's what we found about your plant</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Identified as</p>
            <h3 className="text-xl font-medium text-neutral-800 dark:text-neutral-100">{result.species}</h3>
          </div>

          <div
            className={`inline-flex items-center px-3 py-1 rounded-full ${getHealthStatusColor(result.healthStatus)}`}
          >
            {getHealthStatusIcon(result.healthStatus)}
            <span className="ml-1.5 text-sm font-medium capitalize">
              {result.healthStatus}
              {result.diseaseName && result.healthStatus === "unhealthy" && `: ${result.diseaseName}`}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-700 pt-4">
          <h4 className="flex items-center text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-3">
            <Droplet className="h-5 w-5 mr-2 text-blue-500" />
            Care Recommendations
          </h4>

          <ul className="space-y-3">
            {(result.recommendations || []).length > 0 ? (
              (result.recommendations || []).map((recommendation, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-300">{recommendation}</span>
                </motion.li>
              ))
            ) : (
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start"
              >
                <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-3 mt-0.5">
                  1
                </span>
                <span className="text-neutral-700 dark:text-neutral-300">
                  Continue with regular care and monitoring. Your plant appears to be in good condition.
                </span>
              </motion.li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Sun className="h-5 w-5 text-yellow-500 mr-2" />
            <h4 className="font-medium text-neutral-800 dark:text-neutral-100">Light</h4>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Most plants need at least some bright, indirect light. Adjust based on species requirements.
          </p>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Thermometer className="h-5 w-5 text-red-500 mr-2" />
            <h4 className="font-medium text-neutral-800 dark:text-neutral-100">Temperature</h4>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Most houseplants thrive between 65-75°F (18-24°C). Avoid drafts and temperature extremes.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors flex items-center justify-center ${
              isSaving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span>Save to My Plants</span>
              </>
            )}
          </button>
        )}
        <button
          onClick={onReset}
          disabled={isSaving}
          className={`flex-1 px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-md transition-colors ${
            isSaving ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          Analyze Another Plant
        </button>
      </div>
    </motion.div>
  )
}

export default Result
