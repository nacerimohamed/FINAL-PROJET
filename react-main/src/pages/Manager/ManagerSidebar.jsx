import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiShoppingCart, 
  FiGrid,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiChevronLeft
} from "react-icons/fi";

const ManagerSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  // Détection de la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Version mobile : Header avec bouton hamburger
  if (isMobile) {
    return (
      <>
        {/* Header mobile */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-700 to-green-600 text-white px-4 py-3 shadow-lg z-50 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-xl">🌾</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Coopérative</h2>
              <p className="text-green-200 text-xs">Espace Gestion</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Overlay sombre */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar mobile coulissante */}
        <div className={`
          fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-green-700 to-green-800 text-white z-50
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Header de la sidebar */}
          <div className="p-5 border-b border-green-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-xl">🌾</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Coopérative</h2>
                  <p className="text-green-200 text-xs">Espace Gestion</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="flex flex-col gap-2 p-4 flex-1">
            <li>
              <Link
                to="/manager/dashboard"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isActive('/manager/dashboard')
                    ? 'bg-white text-green-700 shadow-lg'
                    : 'hover:bg-white/10 hover:translate-x-2'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive('/manager/dashboard') ? 'bg-green-100' : 'bg-white/10'
                }`}>
                  <FiGrid className={`text-lg ${
                    isActive('/manager/dashboard') ? 'text-green-700' : 'text-white'
                  }`} />
                </div>
                <span className="font-medium">Tableau de Bord</span>
                {isActive('/manager/dashboard') && (
                  <span className="ml-auto w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                )}
              </Link>
            </li>
            
            <li>
              <Link
                to="/manager/products"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isActive('/manager/products')
                    ? 'bg-white text-green-700 shadow-lg'
                    : 'hover:bg-white/10 hover:translate-x-2'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive('/manager/products') ? 'bg-green-100' : 'bg-white/10'
                }`}>
                  <FiShoppingCart className={`text-lg ${
                    isActive('/manager/products') ? 'text-green-700' : 'text-white'
                  }`} />
                </div>
                <span className="font-medium">Gestion des Produits</span>
                {isActive('/manager/products') && (
                  <span className="ml-auto w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                )}
              </Link>
            </li>
           
            <li>
              <Link
                to="/"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-white text-green-700 shadow-lg'
                    : 'hover:bg-white/10 hover:translate-x-2'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive('/') ? 'bg-green-100' : 'bg-white/10'
                }`}>
                  <FiHome className={`text-lg ${
                    isActive('/') ? 'text-green-700' : 'text-white'
                  }`} />
                </div>
                <span className="font-medium">Accueil Site</span>
                {isActive('/') && (
                  <span className="ml-auto w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                )}
              </Link>
            </li>
          </ul>

          {/* User Info & Logout */}
          <div className="p-5 border-t border-green-600">
            <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-xs text-green-200 mb-1">Connecté en tant que</p>
              <p className="font-semibold text-white truncate">
                {JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Manager'}
              </p>
              <p className="text-xs text-green-300/80 mt-1 truncate">
                {JSON.parse(localStorage.getItem('user') || '{}')?.email || ''}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <FiLogOut className="group-hover:rotate-12 transition-transform duration-300" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Espace pour compenser le header fixe */}
        <div className="h-[72px]"></div>
      </>
    );
  }

  // Version Desktop (inchangée mais avec améliorations visuelles)
  return (
    <div className="w-64 lg:w-72 bg-gradient-to-b from-green-700 to-green-800 text-white min-h-screen flex flex-col shadow-2xl sticky top-0">
      {/* Logo/Header */}
      <div className="p-6 border-b border-green-600/50">
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-2xl animate-pulse">🌾</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Coopérative</h2>
            <p className="text-green-200 text-sm">Espace Gestion</p>
          </div>
        </div>
        <p className="text-xs text-green-300/80 ml-1 mt-2">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Navigation Menu */}
      <ul className="flex flex-col gap-2 flex-1 p-4">
        <li>
          <Link
            to="/manager/dashboard"
            className={`group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
              isActive('/manager/dashboard')
                ? 'bg-white text-green-700 shadow-lg'
                : 'hover:bg-white/10 hover:translate-x-1'
            }`}
          >
            <FiGrid className={`text-lg transition-transform group-hover:scale-110 ${
              isActive('/manager/dashboard') ? 'text-green-700' : ''
            }`} />
            <span className="font-medium text-sm lg:text-base">Tableau de Bord</span>
            {isActive('/manager/dashboard') && (
              <span className="ml-auto w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            )}
          </Link>
        </li>
        
        <li>
          <Link
            to="/manager/products"
            className={`group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
              isActive('/manager/products')
                ? 'bg-white text-green-700 shadow-lg'
                : 'hover:bg-white/10 hover:translate-x-1'
            }`}
          >
            <FiShoppingCart className={`text-lg transition-transform group-hover:scale-110 ${
              isActive('/manager/products') ? 'text-green-700' : ''
            }`} />
            <span className="font-medium text-sm lg:text-base">Gestion des Produits</span>
            {isActive('/manager/products') && (
              <span className="ml-auto w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            )}
          </Link>
        </li>
       
        <li>
          <Link
            to="/"
            className={`group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
              isActive('/')
                ? 'bg-white text-green-700 shadow-lg'
                : 'hover:bg-white/10 hover:translate-x-1'
            }`}
          >
            <FiHome className={`text-lg transition-transform group-hover:scale-110 ${
              isActive('/') ? 'text-green-700' : ''
            }`} />
            <span className="font-medium text-sm lg:text-base">Accueil Site</span>
            {isActive('/') && (
              <span className="ml-auto w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            )}
          </Link>
        </li>
      </ul>

      {/* User Info & Logout */}
      <div className="p-6 border-t border-green-600/50">
        <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
          <p className="text-xs text-green-200 mb-1">Connecté en tant que</p>
          <p className="font-semibold text-white truncate text-sm lg:text-base">
            {JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Manager'}
          </p>
          <p className="text-xs text-green-300/80 mt-1 truncate">
            {JSON.parse(localStorage.getItem('user') || '{}')?.email || ''}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="group w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm lg:text-base"
        >
          <FiLogOut className="group-hover:rotate-12 transition-transform duration-300" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerSidebar;