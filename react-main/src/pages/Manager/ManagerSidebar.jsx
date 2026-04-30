import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiShoppingCart, 
  FiGrid,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";

const ManagerSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (isMobile) setIsMobileMenuOpen(false);
  };

  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <>
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-green-700 text-white px-4 py-3 z-50 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🌾</span>
            <div>
              <h2 className="font-bold">Coopérative</h2>
              <p className="text-xs text-green-200">Espace Gestion</p>
            </div>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-72 bg-green-800 text-white z-50 transform transition-transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>

          <div className="p-5 border-b border-green-600">
            <h2 className="font-bold text-xl">Menu</h2>
          </div>

          <ul className="p-4 space-y-2">

            {/* Accueil FIRST */}
            <li>
              <Link
                to="/manager/home"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  isActive("/manager/home") ? "bg-white text-green-700" : "hover:bg-white/10"
                }`}
              >
                <FiHome />
                Accueil
              </Link>
            </li>

            <li>
              <Link
                to="/manager/dashboard"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  isActive("/manager/dashboard") ? "bg-white text-green-700" : "hover:bg-white/10"
                }`}
              >
                <FiGrid />
                Tableau de Bord
              </Link>
            </li>

            <li>
              <Link
                to="/manager/products"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  isActive("/manager/products") ? "bg-white text-green-700" : "hover:bg-white/10"
                }`}
              >
                <FiShoppingCart />
                Produits
              </Link>
            </li>

          </ul>

          <div className="p-4 border-t border-green-600">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 p-3 rounded-xl flex items-center justify-center gap-2"
            >
              <FiLogOut />
              Déconnexion
            </button>
          </div>
        </div>

        <div className="h-[72px]"></div>
      </>
    );
  }

  /* ================= DESKTOP ================= */
  return (
    <div className="w-72 bg-green-800 text-white min-h-screen flex flex-col">

      <div className="p-6 border-b border-green-600">
        <h2 className="text-xl font-bold">Coopérative</h2>
      </div>

      <ul className="p-4 space-y-2 flex-1">

        {/* Accueil FIRST */}
        <li>
          <Link
            to="/manager/home"
            className={`flex items-center gap-3 p-3 rounded-xl ${
              isActive("/manager/home") ? "bg-white text-green-700" : "hover:bg-white/10"
            }`}
          >
            <FiHome />
            Accueil
          </Link>
        </li>

        <li>
          <Link
            to="/manager/dashboard"
            className={`flex items-center gap-3 p-3 rounded-xl ${
              isActive("/manager/dashboard") ? "bg-white text-green-700" : "hover:bg-white/10"
            }`}
          >
            <FiGrid />
            Tableau de Bord
          </Link>
        </li>

        <li>
          <Link
            to="/manager/products"
            className={`flex items-center gap-3 p-3 rounded-xl ${
              isActive("/manager/products") ? "bg-white text-green-700" : "hover:bg-white/10"
            }`}
          >
            <FiShoppingCart />
            Produits
          </Link>
        </li>

      </ul>

      <div className="p-4 border-t border-green-600">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 p-3 rounded-xl flex items-center justify-center gap-2"
        >
          <FiLogOut />
          Déconnexion
        </button>
      </div>

    </div>
  );
};

export default ManagerSidebar;