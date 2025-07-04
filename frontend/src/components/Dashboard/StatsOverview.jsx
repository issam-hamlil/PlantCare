import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Leaf,
  Droplet,
  AlertTriangle,
  ThumbsUp,
  TrendingUp,
  Calendar,
} from 'lucide-react';

const StatsOverview = ({ stats }) => {
  const { t } = useTranslation();

  const statCards = [
    {
      icon: Leaf,
      title: t('dashboard.totalPlants'),
      value: stats.totalPlants,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      icon: ThumbsUp,
      title: t('dashboard.healthyPlants'),
      value: stats.healthyPlants,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: AlertTriangle,
      title: t('dashboard.needsAttention'),
      value: stats.needsAttention,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      icon: Droplet,
      title: t('plants.lastWatered'),
      value: stats.needWatering,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-500" />
              Activity Trends
            </h3>
          </div>
          <div className="h-48 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
            {/* Placeholder for activity chart */}
            <p>Activity chart will be displayed here</p>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary-500" />
              Recent Activities
            </h3>
          </div>
          <div className="space-y-4">
            {stats.recentActivities?.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      activity.type === 'watering'
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-green-50 dark:bg-green-900/20'
                    }`}
                  >
                    {activity.type === 'watering' ? (
                      <Droplet className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Leaf className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsOverview;