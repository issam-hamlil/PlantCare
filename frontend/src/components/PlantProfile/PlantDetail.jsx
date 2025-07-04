import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Droplet,
  Sun,
  Thermometer,
  Wind,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

const PlantDetail = ({ plant }) => {
  const { t } = useTranslation();

  if (!plant) return null;

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'unhealthy':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative h-64">
        <img
          src={plant.image}
          alt={plant.name}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded-full ${getHealthStatusColor(
            plant.healthStatus
          )}`}
        >
          <div className="flex items-center space-x-1">
            {plant.healthStatus === 'healthy' ? (
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span className="text-sm font-medium capitalize">
              {plant.healthStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
            {plant.name}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 italic">
            {plant.species}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Droplet className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-neutral-900 dark:text-white">
                {t('plants.wateringSchedule')}
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Every {plant.waterFrequency} days
            </p>
            {plant.lastWatered && (
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                Last watered {formatRelativeTime(plant.lastWatered)}
              </p>
            )}
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Sun className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium text-neutral-900 dark:text-white">
                {t('plants.sunlight')}
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 capitalize">
              {plant.sunlight} light
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Wind className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-neutral-900 dark:text-white">
                {t('plants.humidity')}
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 capitalize">
              {plant.humidity} humidity
            </p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="font-medium text-neutral-900 dark:text-white">
                Added
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              {formatDate(plant.dateAdded)}
            </p>
          </div>
        </div>

        {plant.notes && (
          <div className="mb-6">
            <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
              Notes
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg">
              {plant.notes}
            </p>
          </div>
        )}

        <div className="flex space-x-4">
          <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors">
            Record Watering
          </button>
          <button className="flex-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white py-2 px-4 rounded-lg transition-colors">
            Edit Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlantDetail;