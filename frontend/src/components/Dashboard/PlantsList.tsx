import React, { useState } from 'react';
import { Plant } from '../../services/plantService';
import { motion } from 'framer-motion';
import { Droplet, Sun, Wind, AlertTriangle, Info } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface PlantsListProps {
  plants: Plant[];
  onSelect: (plant: Plant) => void;
  onDelete: (id: string) => void;
  onWater: (id: string) => void;
}

const PlantsList: React.FC<PlantsListProps> = ({ plants, onSelect, onDelete, onWater }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'warning' | 'unhealthy'>('all');

  const filteredPlants = filterStatus === 'all' 
    ? plants 
    : plants.filter(plant => plant.healthStatus === filterStatus);

  // Sort plants: Unhealthy first, then warnings, then healthy
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    const statusOrder = { unhealthy: 0, warning: 1, healthy: 2 };
    return statusOrder[a.healthStatus] - statusOrder[b.healthStatus];
  });

  // Calculate days since last watered
  const getDaysSinceWatered = (lastWatered?: string) => {
    if (!lastWatered) return null;
    const waterDate = new Date(lastWatered);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - waterDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">My Plants</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterStatus === 'all' 
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterStatus('healthy')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterStatus === 'healthy' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            Healthy
          </button>
          <button 
            onClick={() => setFilterStatus('warning')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterStatus === 'warning' 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            Needs Attention
          </button>
          <button 
            onClick={() => setFilterStatus('unhealthy')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterStatus === 'unhealthy' 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            Unhealthy
          </button>
        </div>
      </div>

      {sortedPlants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Info className="h-12 w-12 text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">No plants found</h3>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
            {filterStatus === 'all' 
              ? "You haven't added any plants yet. Add your first plant to start tracking its health."
              : `You don't have any ${filterStatus} plants.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPlants.map(plant => {
            const daysSinceWatered = getDaysSinceWatered(plant.lastWatered);
            const needsWater = daysSinceWatered !== null && daysSinceWatered >= plant.waterFrequency;
            
            return (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-white dark:bg-neutral-900 rounded-lg overflow-hidden shadow border ${
                  plant.healthStatus === 'healthy' 
                    ? 'border-green-200 dark:border-green-900' 
                    : plant.healthStatus === 'warning'
                    ? 'border-yellow-200 dark:border-yellow-900'
                    : 'border-red-200 dark:border-red-900'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={plant.image} 
                    alt={plant.name} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute top-2 right-2">
                    <div 
                      className={`rounded-full p-1 ${
                        plant.healthStatus === 'healthy' 
                          ? 'bg-green-500' 
                          : plant.healthStatus === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {plant.healthStatus === 'healthy' ? (
                        <span className="block h-3 w-3 rounded-full"></span>
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-100 mb-1">{plant.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 italic mb-3">{plant.species}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-3">
                      <div className="flex items-center text-neutral-600 dark:text-neutral-400" title="Water needs">
                        <Droplet className="h-4 w-4 mr-1" />
                        <span className="text-xs">Every {plant.waterFrequency} days</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        Added {format(new Date(plant.dateAdded), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div title="Sunlight needs" className="flex items-center px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">
                        <Sun className="h-3 w-3 mr-1 text-yellow-500" />
                        <span>{plant.sunlight}</span>
                      </div>
                      <div title="Humidity needs" className="flex items-center px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">
                        <Wind className="h-3 w-3 mr-1 text-blue-500" />
                        <span>{plant.humidity}</span>
                      </div>
                    </div>
                  </div>
                  
                  {plant.lastWatered && (
                    <div className={`text-xs ${
                      needsWater ? 'text-red-600 dark:text-red-400' : 'text-neutral-600 dark:text-neutral-400'
                    } mb-4`}>
                      {needsWater 
                        ? `Needs water! Last watered ${daysSinceWatered} days ago.` 
                        : `Last watered ${formatDistanceToNow(new Date(plant.lastWatered))} ago`}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onWater(plant.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-300 rounded-md text-sm font-medium transition-colors"
                    >
                      <Droplet className="h-4 w-4 mr-1" />
                      Water
                    </button>
                    <button 
                      onClick={() => onSelect(plant)}
                      className="flex-1 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 rounded-md text-sm font-medium transition-colors"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => onDelete(plant.id)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-300 rounded-md text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlantsList;