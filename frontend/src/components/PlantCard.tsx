import React from 'react';
import { Plant } from '../types';
import { Droplets, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlantCardProps {
  plant: Plant;
  onClick: () => void;
  onWaterClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  selected?: boolean;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick, onWaterClick, onDeleteClick, selected }) => {
  // Determine if the plant has been watered
  const isWatered = !!plant.lastWatered;

  // Get health status color
  const getHealthIcon = (status: string) => {
    if (status === 'healthy') {
      return <span className="text-green-500 mr-1">●</span>;
    } else if (status === 'unhealthy') {
      return <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />;
    } else {
      return <span className="text-gray-400 mr-1">○</span>;
    }
  };

  const healthColors = {
    healthy: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400',
    },
    unhealthy: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
    },
    unknown: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
    },
  }[plant.healthStatus || 'unknown'];

  // Get image URL
  const imageUrl = plant.imagePath 
    ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${plant.imagePath.replace(/\\/g, '/')}`
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <motion.div
      whileHover={{ translateY: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 
        ${selected ? 'ring-4 ring-emerald-500/50 dark:ring-emerald-500/30 shadow-xl shadow-emerald-500/10' : 'hover:shadow-xl hover:shadow-emerald-500/5'}`}
      onClick={onClick}
    >
      {/* Plant Image */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={plant.species || 'Plant'} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Action buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
          <button
            onClick={onWaterClick}
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
            onClick={onDeleteClick}
            className="bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transform transition-transform hover:scale-110"
            aria-label="Delete plant"
            title="Delete plant"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Plant Info */}
      <div className="p-4">
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

        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1 truncate">
          {plant.species || 'Unknown Plant'}
        </h3>
        
        {plant.recommendations && plant.recommendations.length > 0 && (
          <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="font-medium">Recommendation:</span> {plant.recommendations[0]}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlantCard; 