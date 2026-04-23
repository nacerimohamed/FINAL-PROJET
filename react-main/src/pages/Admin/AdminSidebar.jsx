// src/pages/admin/AdminSidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";

const AdminSidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Détecter les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false); // Fermer le menu mobile sur desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path;

  // Fermer le menu mobile quand on navigue
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: "/admin/users",
      label: "Gérer les utilisateurs",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      path: "/admin/cooperatives",
      label: "Gérer les coopératives",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      path: "/",
      label: "Accueil",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      )
    }
  ];

  // Version mobile : Bouton de menu hamburger
  if (isMobile) {
    return (
      <>
        {/* Header mobile avec bouton menu */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-800 to-green-700 text-white p-4 shadow-lg z-50 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Overlay sombre quand le menu est ouvert */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar mobile glissante */}
        <div className={`
          fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-green-800 via-green-700 to-green-800 text-white z-50 
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Header de la sidebar mobile */}
          <div className="p-6 border-b border-green-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌾</span>
                </div>
                <h2 className="text-xl font-bold">Admin Panel</h2>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Menu Items mobile */}
          <ul className="flex flex-col gap-2 flex-1 p-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-white text-green-700 shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <span className={isActive(item.path) ? 'text-green-700' : ''}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* User Info & Logout mobile */}
          <div className="p-6 border-t border-green-600/50">
            <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-xs text-green-200 mb-1">Connecté en tant que</p>
              <p className="font-semibold text-white truncate">
                {JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Administrateur'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-300 font-semibold shadow-lg"
            >
              <FiLogOut className="group-hover:rotate-12 transition-transform" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Espace pour compenser le header mobile fixe */}
        <div className="h-[72px]"></div>
      </>
    );
  }

  // Version Desktop (inchangée mais avec quelques améliorations)
  return (
    <div className="w-64 lg:w-72 bg-gradient-to-b from-green-800 via-green-700 to-green-800 text-white min-h-screen flex flex-col shadow-2xl sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-green-600/50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-2xl">🌾</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold">Admin Panel</h2>
        </div>
        <p className="text-xs text-green-300/80 ml-1">
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Menu Items */}
      <ul className="flex flex-col gap-2 flex-1 p-4">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-white text-green-700 shadow-lg scale-[1.02]'
                  : 'hover:bg-white/10 hover:translate-x-1'
              }`}
            >
              <span className={`transition-transform group-hover:scale-110 ${
                isActive(item.path) ? 'text-green-700' : ''
              }`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm lg:text-base">{item.label}</span>
              {isActive(item.path) && (
                <span className="ml-auto w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Info & Logout */}
      <div className="p-6 border-t border-green-600/50">
        <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
          <p className="text-xs text-green-200 mb-1">Connecté en tant que</p>
          <p className="font-semibold text-white truncate text-sm lg:text-base">
            {JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Administrateur'}
          </p>
          <p className="text-xs text-green-300/80 mt-1">
            {JSON.parse(localStorage.getItem('user') || '{}')?.email || ''}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="group w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FiLogOut className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm lg:text-base">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;