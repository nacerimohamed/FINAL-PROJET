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
import managerLogo from "../../assets/manager_logo.png";

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
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-green-500 shadow-sm bg-white">
              <img src={managerLogo} alt="Manager" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold">Manager</h2>
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
        <div className={`fixed top-0 left-0 h-full w-72 bg-green-800 text-white z-50 transform transition-transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}>

          <div className="p-5 border-b border-green-600">
            <h2 className="font-bold text-xl">Menu</h2>
          </div>

          <ul className="p-4 space-y-2">

            {/* Accueil FIRST */}
            <li>
              <Link
                to="/"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 p-3 rounded-xl ${isActive("/") ? "bg-white text-green-700" : "hover:bg-white/10"
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
                className={`flex items-center gap-3 p-3 rounded-xl ${isActive("/manager/dashboard") ? "bg-white text-green-700" : "hover:bg-white/10"
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
                className={`flex items-center gap-3 p-3 rounded-xl ${isActive("/manager/products") ? "bg-white text-green-700" : "hover:bg-white/10"
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
              className="group w-full p-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 font-bold text-white shadow-lg hover:shadow-2xl transform hover:scale-[1.03] hover:-translate-y-0.5 border border-white/20 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #e8a820 0%, #d4a032 25%, #c4a83a 50%, #9cb33a 75%, #7faa35 100%)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <FiLogOut className="w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-700 relative z-10 drop-shadow-sm" />
              <span className="relative z-10 drop-shadow-sm">Déconnexion</span>
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
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-green-500 shadow-lg bg-white">
            <img src={managerLogo} alt="Manager" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Manager</h2>
            <p className="text-xs text-green-300">Espace Manager</p>
          </div>
        </div>
      </div>

      <ul className="p-4 space-y-2 flex-1">

        {/* Accueil FIRST */}
        <li>
          <Link
            to="/"
            className={`flex items-center gap-3 p-3 rounded-xl ${isActive("/") ? "bg-white text-green-700" : "hover:bg-white/10"
              }`}
          >
            <FiHome />
            Accueil
          </Link>
        </li>

        <li>
          <Link
            to="/manager/dashboard"
            className={`flex items-center gap-3 p-3 rounded-xl ${isActive("/manager/dashboard") ? "bg-white text-green-700" : "hover:bg-white/10"
              }`}
          >
            <FiGrid />
            Tableau de Bord
          </Link>
        </li>

        <li>
          <Link
            to="/manager/products"
            className={`flex items-center gap-3 p-3 rounded-xl ${isActive("/manager/products") ? "bg-white text-green-700" : "hover:bg-white/10"
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
          className="group w-full p-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 font-bold text-white shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-0.5 border border-white/20 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #e8a820 0%, #d4a032 25%, #c4a83a 50%, #9cb33a 75%, #7faa35 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          <FiLogOut className="w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-700 relative z-10 drop-shadow-sm" />
          <span className="relative z-10 drop-shadow-sm">Déconnexion</span>
        </button>
      </div>

    </div>
  );
};

export default ManagerSidebar;