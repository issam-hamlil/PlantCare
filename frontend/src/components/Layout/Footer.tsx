import React from 'react';
import { Link } from 'react-router-dom';
import plantCareLogo from "../../assets/PlantCare_logo.png"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-neutral-900 dark:via-emerald-950 dark:to-green-950 border-t border-emerald-200 dark:border-emerald-800 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="group flex items-center space-x-3 w-fit">
              <div className="relative">
                <img
                  src={plantCareLogo}
                  alt="PlantCare"
                  className="h-20 w-20 transition-all duration-300 group-hover:scale-110 drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-600/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 dark:from-emerald-400 dark:via-green-300 dark:to-teal-400 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-green-400 transition-all duration-500">
                PlantCare
              </span>
            </Link>
            <p className="mt-6 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Meet your personal plant care assistant — a smart and reliable companion that helps you monitor, nurture, and maintain the health of your plants.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-200 dark:border-emerald-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
           
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;