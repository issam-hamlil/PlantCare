"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"
import plantCareLogo from "../../assets/PlantCare_logo.png"
import { Menu, X, User, LogOut, Sun, Moon, Home, BarChart2, Search, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom";


const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location])

  const handleLogout = async () => {
    await logout()
    navigate("/auth")
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/90 backdrop-blur-2xl shadow-2xl shadow-emerald-500/10 border-b border-emerald-100/30 dark:border-emerald-900/20"
          : "bg-gradient-to-r from-white/70 via-emerald-50/20 to-white/70 dark:from-slate-950/70 dark:via-emerald-950/10 dark:to-slate-950/70 backdrop-blur-sm"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[50%] bg-[radial-gradient(circle_at_50%_120%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.05),transparent_70%)]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center py-1">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group relative">
            <div className="relative">
             <img
                src={plantCareLogo}
              alt="PlantCare"
              className="h-20 w-20 transition-transform duration-100 group-hover:scale-110"
                />


             
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 dark:from-emerald-400 dark:via-green-300 dark:to-teal-400 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-green-400 transition-all duration-500">
                PlantCare
              </span>
             
            </div>
            <div className="absolute -bottom-1 left-12 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <Link
              to="/"
              className={`group relative flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-medium transition-all duration-500 overflow-hidden ${
                location.pathname === "/"
                  ? "text-white shadow-lg shadow-emerald-500/30"
                  : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
              }`}
            >
              {location.pathname === "/" && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
              )}
              {location.pathname !== "/" && (
                <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500 bg-[length:250%_100%] bg-right group-hover:bg-left hover:bg-right duration-1500"></div>
              <Home
                className={`h-4 w-4 transition-all duration-500 ${location.pathname === "/" ? "text-white" : "text-emerald-600 dark:text-emerald-400"} group-hover:scale-125`}
              />
              <span className="text-sm relative">
                Home
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              </span>
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`group relative flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-medium transition-all duration-500 overflow-hidden ${
                    location.pathname === "/dashboard"
                      ? "text-white shadow-lg shadow-emerald-500/30"
                      : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                  }`}
                >
                  {location.pathname === "/dashboard" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
                  )}
                  {location.pathname !== "/dashboard" && (
                    <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500 bg-[length:250%_100%] bg-right group-hover:bg-left hover:bg-right duration-1500"></div>
                  <BarChart2
                    className={`h-4 w-4 transition-all duration-500 ${location.pathname === "/dashboard" ? "text-white" : "text-emerald-600 dark:text-emerald-400"} group-hover:scale-125`}
                  />
                  <span className="text-sm relative">
                    Dashboard
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                  </span>
                </Link>

                <Link
                  to="/analysis"
                  className={`group relative flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-medium transition-all duration-500 overflow-hidden ${
                    location.pathname === "/analysis"
                      ? "text-white shadow-lg shadow-emerald-500/30"
                      : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                  }`}
                >
                  {location.pathname === "/analysis" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
                  )}
                  {location.pathname !== "/analysis" && (
                    <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500 bg-[length:250%_100%] bg-right group-hover:bg-left hover:bg-right duration-1500"></div>
                  <Search
                    className={`h-4 w-4 transition-all duration-500 ${location.pathname === "/analysis" ? "text-white" : "text-emerald-600 dark:text-emerald-400"} group-hover:scale-125`}
                  />
                  <span className="text-sm relative">
                    Plant Analysis
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                  </span>
                </Link>

                <Link
                  to="/profile"
                  className={`group relative flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-medium transition-all duration-500 overflow-hidden ${
                    location.pathname === "/profile"
                      ? "text-white shadow-lg shadow-emerald-500/30"
                      : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                  }`}
                >
                  {location.pathname === "/profile" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
                  )}
                  {location.pathname !== "/profile" && (
                    <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500 bg-[length:250%_100%] bg-right group-hover:bg-left hover:bg-right duration-1500"></div>
                  <Settings
                    className={`h-4 w-4 transition-all duration-500 ${location.pathname === "/profile" ? "text-white" : "text-emerald-600 dark:text-emerald-400"} group-hover:scale-125`}
                  />
                  <span className="text-sm relative">
                    Profile
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                  </span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group relative p-3 rounded-full overflow-hidden transition-all duration-500 hover:scale-110"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-400 group-hover:text-amber-300 transition-all duration-500 group-hover:rotate-45 group-hover:scale-110" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600 group-hover:text-emerald-600 transition-all duration-500 group-hover:-rotate-45 group-hover:scale-110" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full border border-emerald-200/50 dark:border-emerald-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-100"></div>
            </button>

            {/* User Menu or Auth Link */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4 relative group">
                <div className="absolute inset-0 -m-2 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className="relative flex items-center space-x-3 bg-gradient-to-r from-emerald-50/80 to-white/80 dark:from-emerald-900/30 dark:to-slate-900/80 px-5 py-2.5 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg shadow-emerald-500/5 group-hover:shadow-emerald-500/10 transition-all duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="text-white text-sm font-bold relative z-10">
                        {user.name.split(" ")[0].charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hello,{" "}
                    <span className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                      {user.name.split(" ")[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group relative flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg overflow-hidden transition-colors duration-500"
                  >
                    <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <LogOut className="relative z-10 h-4 w-4 group-hover:scale-110 transition-transform duration-500" />
                    <span className="relative z-10">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex group relative items-center space-x-2 px-6 py-2.5 rounded-2xl text-white font-medium transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
                <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500 bg-[length:250%_100%] bg-right group-hover:bg-left hover:bg-right duration-1500"></div>
                <div className="absolute inset-0 border border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100"></div>
                <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-500" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden group relative p-3 rounded-full overflow-hidden transition-all duration-500"
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500" />
                ) : (
                  <Menu className="h-6 w-6 text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500" />
                )}
              </div>
              <div className="absolute inset-0 rounded-full border border-emerald-200/50 dark:border-emerald-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75 group-hover:scale-100"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-emerald-200/30 dark:border-emerald-800/20 shadow-2xl"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/"
                className={`group relative flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-500 overflow-hidden ${
                  location.pathname === "/"
                    ? "text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                }`}
              >
                {location.pathname === "/" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
                )}
                {location.pathname !== "/" && (
                  <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                <Home className="relative z-10 h-5 w-5 group-hover:scale-110 transition-transform duration-500" />
                <span className="relative z-10">Home</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`group relative flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-500 overflow-hidden ${
                      location.pathname === "/dashboard"
                        ? "text-white shadow-lg shadow-emerald-500/20"
                        : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                    }`}
                  >
                    {location.pathname === "/dashboard" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
                    )}
                    {location.pathname !== "/dashboard" && (
                      <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                    <BarChart2 className="relative z-10 h-5 w-5 group-hover:scale-110 transition-transform duration-500" />
                    <span className="relative z-10">Dashboard</span>
                  </Link>

                  <Link
                    to="/analysis"
                    className={`group relative flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-500 overflow-hidden ${
                      location.pathname === "/analysis"
                        ? "text-white shadow-lg shadow-emerald-500/20"
                        : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                    }`}
                  >
                    {location.pathname === "/analysis" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
                    )}
                    {location.pathname !== "/analysis" && (
                      <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                    <Search className="relative z-10 h-5 w-5 group-hover:scale-110 transition-transform duration-500" />
                    <span className="relative z-10">Plant Analysis</span>
                  </Link>

                  <Link
                    to="/profile"
                    className={`group relative flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-500 overflow-hidden ${
                      location.pathname === "/profile"
                        ? "text-white shadow-lg shadow-emerald-500/20"
                        : "text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                    }`}
                  >
                    {location.pathname === "/profile" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
                    )}
                    {location.pathname !== "/profile" && (
                      <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500"></div>
                    <Settings className="relative z-10 h-5 w-5 group-hover:scale-110 transition-transform duration-500" />
                    <span className="relative z-10">Profile</span>
                  </Link>

                  <div className="border-t border-emerald-200/30 dark:border-emerald-800/20 pt-4 mt-4">
                    <div className="group relative flex items-center space-x-3 px-4 py-4 bg-gradient-to-r from-emerald-50/80 to-white/80 dark:from-emerald-900/30 dark:to-slate-900/80 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 overflow-hidden">
                          <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <span className="text-white font-bold relative z-10">
                            {user.name.split(" ")[0].charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.name}</div>
                        <div className="text-xs bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full group relative flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl text-base font-medium text-white transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 -z-10"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500 bg-[length:250%_100%] bg-right group-hover:bg-left hover:bg-right duration-1500"></div>
                    <div className="absolute inset-0 border border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100"></div>
                    <LogOut className="relative z-10 h-5 w-5 group-hover:scale-110 transition-transform duration-500" />
                    <span className="relative z-10">Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block w-full group relative px-4 py-3 rounded-2xl text-base font-medium text-center text-white transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 -z-10"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(40deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-500 bg-[length:250%_100%] bg-right group-hover:bg-left hover:bg-right duration-1500"></div>
                  <div className="absolute inset-0 border border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-500" />
                    <span>Sign In</span>
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
