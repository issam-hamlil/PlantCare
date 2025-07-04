import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Sprout,
  User,
  Settings,
  Search,
  BarChart2,
  Bell,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { icon: Home, label: t('common.home'), path: '/' },
    { icon: BarChart2, label: t('dashboard.overview'), path: '/dashboard' },
    { icon: Sprout, label: t('plants.myPlants'), path: '/plants' },
    { icon: Search, label: t('plants.analyze'), path: '/analysis' },
    { icon: User, label: t('profile.account'), path: '/profile' },
    { icon: Bell, label: t('profile.notifications'), path: '/notifications' },
    { icon: Settings, label: t('profile.settings'), path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-neutral-800 h-full shadow-lg">
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2 mb-8">
          <Sprout className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
            PlantCare
          </span>
        </Link>

        <nav className="space-y-1">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors
                ${
                  location.pathname === path
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
