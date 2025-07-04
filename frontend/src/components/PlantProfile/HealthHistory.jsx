import React from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/formatters';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const HealthHistory = ({ history }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'unhealthy':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'unhealthy':
        return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-neutral-700 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
        Health History
      </h2>

      <div className="space-y-4">
        {history.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border-l-4 pl-4 py-2"
            style={{
              borderColor:
                entry.status === 'healthy'
                  ? '#10B981'
                  : entry.status === 'warning'
                  ? '#F59E0B'
                  : '#EF4444',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(entry.status)}
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      entry.status
                    )}`}
                  >
                    {entry.status}
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  {entry.notes}
                </p>
              </div>
              <span className="text-sm text-neutral-500 dark:text-neutral-500">
                {formatDate(entry.date)}
              </span>
            </div>

            {entry.recommendations && (
              <div className="mt-2 pl-6">
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Recommendations:
                </h4>
                <ul className="list-disc pl-4 text-sm text-neutral-600 dark:text-neutral-400">
                  {entry.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HealthHistory;