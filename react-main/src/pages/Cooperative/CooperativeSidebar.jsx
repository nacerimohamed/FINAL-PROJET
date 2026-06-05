import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CooperativeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("http://127.0.0.1:8000/api/logout", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const isActive = (path) => {
    if (path === '/cooperative/dashboard') {
      return location.pathname === '/cooperative/dashboard';
    }
    return location.pathname.includes(path);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Contenu de la sidebar (réutilisable)
  const SidebarContent = () => (
    <>
      {/* Logo / Header */}
      <div className="p-4 sm:p-5 lg:p-6 border-b border-emerald-700/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight">Espace Coop</h2>
            <p className="text-emerald-300 text-[10px] sm:text-xs font-medium">Gestion professionnelle</p>
          </div>
        </div>
      </div>

      {/* Navigation - prend tout l'espace disponible */}
      <nav className="flex-1 py-4 sm:py-5 lg:py-6 px-3 sm:px-4 space-y-1">
        <Link 
          to="/cooperative/dashboard" 
          onClick={closeMobileMenu}
          className={`
            group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 font-medium text-xs sm:text-sm
            ${isActive('/cooperative/dashboard') 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
              : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
            }
          `}
        >
          <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isActive('/cooperative/dashboard') ? 'text-white' : 'text-emerald-300 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Tableau de bord</span>
          {isActive('/cooperative/dashboard') && (
            <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          )}
        </Link>

        <Link 
          to="/cooperative/products" 
          onClick={closeMobileMenu}
          className={`
            group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 font-medium text-xs sm:text-sm
            ${isActive('/cooperative/products') 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
              : 'text-emerald-100 hover:bg-emerald-700/50 hover:text-white'
            }
          `}
        >
          <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isActive('/cooperative/products') ? 'text-white' : 'text-emerald-300 group-hover:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Mes Produits</span>
          {isActive('/cooperative/products') && (
            <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          )}
        </Link>
      </nav>

      {/* Bouton Déconnexion - TOUT EN BAS */}
      <div className="p-3 sm:p-4 border-t border-emerald-700/50">
        <button 
          onClick={handleLogout} 
          className="group flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-98 text-xs sm:text-sm"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Déconnexion</span>
        </button>
      
      </div>
    </>
  );

  return (
    <>
      {/* Version Mobile - Burger Menu */}
      {isMobile && (
        <>
          {/* Bouton hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="fixed top-4 left-4 z-50 p-2 bg-emerald-700 rounded-lg shadow-lg lg:hidden"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar mobile */}
          <div className={`
            fixed top-0 left-0 h-full z-50 transition-transform duration-300 transform lg:hidden
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="w-64 sm:w-72 h-full bg-gradient-to-b from-emerald-800 to-emerald-900 shadow-2xl flex flex-col overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </>
      )}

      {/* Version Desktop - Sidebar fixe */}
      <div className="hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white h-screen sticky top-0 shadow-2xl overflow-y-auto">
        <SidebarContent />
      </div>
    </>
  );
};

export default CooperativeSidebar;