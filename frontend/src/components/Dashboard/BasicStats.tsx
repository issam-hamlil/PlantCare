import React, { useMemo } from 'react';
import { Plant } from '../../services/plantService';
import { Droplet, Leaf, AlertTriangle, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface BasicStatsProps {
  plants: Plant[];
}

const BasicStats: React.FC<BasicStatsProps> = ({ plants }) => {
  const stats = useMemo(() => {
    // Total plant count
    const totalPlants = plants.length;
    
    // Plants by health status
    const healthyPlants = plants.filter(p => p.healthStatus === 'healthy').length;
    const warningPlants = plants.filter(p => p.healthStatus === 'warning').length;
    const unhealthyPlants = plants.filter(p => p.healthStatus === 'unhealthy').length;
    
    // Plants that need water
    const plantsNeedingWater = plants.filter(plant => {
      if (!plant.lastWatered) return true;
      
      const lastWatered = new Date(plant.lastWatered);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastWatered.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays >= plant.waterFrequency;
    }).length;
    
    return {
      totalPlants,
      healthyPlants,
      warningPlants,
      unhealthyPlants,
      plantsNeedingWater,
      healthyPercentage: totalPlants ? Math.round((healthyPlants / totalPlants) * 100) : 0
    };
  }, [plants]);

  const MotionCard = ({ 
    icon, 
    title, 
    value, 
    color, 
    delay 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    value: number; 
    color: string;
    delay: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`p-2 rounded-md ${color.replace('text-', 'bg-').replace(/-700|-800|-600/, '-100')}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MotionCard
          icon={<Leaf className="h-5 w-5 text-primary-700 dark:text-primary-400" />}
          title="Total Plants"
          value={stats.totalPlants}
          color="text-primary-700 dark:text-primary-400"
          delay={0}
        />
        
        <MotionCard
          icon={<ThumbsUp className="h-5 w-5 text-green-700 dark:text-green-400" />}
          title="Healthy Plants"
          value={stats.healthyPlants}
          color="text-green-700 dark:text-green-400"
          delay={0.1}
        />
        
        <MotionCard
          icon={<AlertTriangle className="h-5 w-5 text-yellow-700 dark:text-yellow-400" />}
          title="Need Attention"
          value={stats.warningPlants}
          color="text-yellow-700 dark:text-yellow-400"
          delay={0.2}
        />
        
        <MotionCard
          icon={<Droplet className="h-5 w-5 text-blue-700 dark:text-blue-400" />}
          title="Need Watering"
          value={stats.plantsNeedingWater}
          color="text-blue-700 dark:text-blue-400"
          delay={0.3}
        />
      </div>

      {stats.totalPlants > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              Plant Health Overview
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {stats.healthyPercentage}% of your plants are healthy
            </p>
          </div>
          
          <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div 
                className="bg-green-500 h-full transition-all duration-500 ease-in-out"
                style={{ width: `${(stats.healthyPlants / stats.totalPlants) * 100}%` }}
              ></div>
              <div 
                className="bg-yellow-500 h-full transition-all duration-500 ease-in-out"
                style={{ width: `${(stats.warningPlants / stats.totalPlants) * 100}%` }}
              ></div>
              <div 
                className="bg-red-500 h-full transition-all duration-500 ease-in-out"
                style={{ width: `${(stats.unhealthyPlants / stats.totalPlants) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex mt-2 text-xs justify-between">
            <div className="flex items-center">
              <span className="bg-green-500 w-3 h-3 rounded-full mr-1"></span>
              <span className="text-neutral-600 dark:text-neutral-300">Healthy</span>
            </div>
            <div className="flex items-center">
              <span className="bg-yellow-500 w-3 h-3 rounded-full mr-1"></span>
              <span className="text-neutral-600 dark:text-neutral-300">Needs Attention</span>
            </div>
            <div className="flex items-center">
              <span className="bg-red-500 w-3 h-3 rounded-full mr-1"></span>
              <span className="text-neutral-600 dark:text-neutral-300">Unhealthy</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BasicStats;