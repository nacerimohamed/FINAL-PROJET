import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiMail, 
  FiLogOut, 
  FiUser,
  FiMenu,
  FiX,
  FiChevronRight,
  FiChevronLeft
} from "react-icons/fi";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur:", error);
        localStorage.removeItem("user");
      }
    }

    // Effet de scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Détection de la taille d'écran
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Bloquer le scroll du body quand le menu mobile est ouvert
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const navLinks = [
    { name: t("navbar.home"), path: "/", icon: FiHome },
    { name: t("navbar.products"), path: "/products", icon: FiShoppingBag },
    { name: t("navbar.cooperatives"), path: "/cooperatives", icon: FiUsers },
    { name: t("navbar.contact"), path: "/contact", icon: FiMail },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-xl py-2 sm:py-3"
            : "bg-white/80 backdrop-blur-sm py-2 sm:py-3"
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-2">
          <div className="flex justify-between items-center">
            {/* Logo - Responsive */}
            <Link
              to="/"
              className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 sm:space-x-3 group`}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <div className="relative">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-xl sm:rounded-2xl flex items-center justify-center transform group-hover:scale-110 ${isRTL ? 'group-hover:-rotate-12' : 'group-hover:rotate-12'} transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
                  <span className="text-base sm:text-xl animate-bounce">🌾</span>
                </div>
                <div className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping`}></div>
                <div className={`absolute -bottom-1 ${isRTL ? '-right-1' : '-left-1'} w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse`}></div>
              </div>
              <div className="relative">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent animate-gradient">
                  {t("navbar.title")}
                </h1>
                <p className="hidden sm:block text-xs text-gray-600 -mt-1 font-medium tracking-wide">{t("navbar.subtitle")}</p>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-transparent group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>

            {/* Desktop Menu - Hidden on mobile */}
            <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-1 xl:space-x-2`}>
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-3 xl:px-5 py-2 xl:py-2.5 text-sm xl:text-base text-gray-700 hover:text-green-600 font-semibold transition-all duration-300 group rounded-xl hover:bg-green-50"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideDown 0.5s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    <span className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-1 xl:space-x-2`}>
                      <Icon className="w-3 h-3 xl:w-4 xl:h-4 group-hover:scale-125 transition-transform duration-300" />
                      <span className="hidden xl:inline">{link.name}</span>
                      <span className="xl:hidden">{link.name.charAt(0)}</span>
                    </span>
                    <span className={`absolute bottom-0 ${isRTL ? 'right-2 xl:right-4' : 'left-2 xl:left-4'} w-0 h-0.5 xl:h-1 bg-gradient-to-r from-green-600 via-green-500 to-green-400 rounded-full group-hover:w-[calc(100%-1rem)] xl:group-hover:w-[calc(100%-2rem)] transition-all duration-500 shadow-lg shadow-green-500/50`}></span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth Buttons - Hidden on mobile */}
            <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 xl:space-x-4`}>
              {/* Language Switcher */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <LanguageSwitcher />
              </div>
              
              {user ? (
                <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 xl:space-x-3 animate-fadeIn`}>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 xl:space-x-3 bg-gradient-to-r from-green-50 to-green-100 px-3 xl:px-5 py-1.5 xl:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-green-200`}>
                    <div className="relative">
                      <div className="w-7 h-7 xl:w-9 xl:h-9 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center ring-2 ring-green-300 ring-offset-2">
                        <span className="text-white text-xs xl:text-sm font-bold">
                          {user.name?.charAt(0).toUpperCase() || t("navbar.user").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 xl:w-3 xl:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <span className="text-gray-800 font-semibold text-sm xl:text-base truncate max-w-[100px] xl:max-w-[150px]">
                      {user.name || t("navbar.user")}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center space-x-1 xl:space-x-2 px-3 xl:px-6 py-1.5 xl:py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 text-sm xl:text-base"
                  >
                    <FiLogOut className="w-3 h-3 xl:w-4 xl:h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="hidden xl:inline">{t("navbar.logout")}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="group relative px-4 xl:px-8 py-2 xl:py-3 bg-gradient-to-r from-green-600 via-green-700 to-green-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white rounded-full transition-all duration-500 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 overflow-hidden text-sm xl:text-base"
                >
                  <span className={`relative z-10 flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} space-x-1 xl:space-x-2`}>
                    <FiUser className="w-3 h-3 xl:w-5 xl:h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden xl:inline">{t("navbar.login")}</span>
                    <span className="xl:hidden">{t("navbar.login").charAt(0)}</span>
                    <svg 
                      className={`w-3 h-3 xl:w-4 xl:h-4 ${isRTL ? 'group-hover:-translate-x-2 rotate-180' : 'group-hover:translate-x-2'} transition-transform duration-300 hidden xl:block`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2.5" 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 sm:p-3 rounded-xl hover:bg-green-50 transition-all duration-300 group border-2 border-transparent hover:border-green-200 relative z-50"
              aria-label={t("navbar.menu") || "Menu mobile"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-green-600 group-hover:rotate-90 transition-all duration-300" />
              ) : (
                <FiMenu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-green-600 group-hover:scale-110 transition-all duration-300" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Slide Panel */}
      <div
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-[280px] sm:w-[320px] bg-gradient-to-br from-white via-green-50 to-white z-50 shadow-2xl lg:hidden transform transition-transform duration-500 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl sm:text-2xl animate-pulse">🌾</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                {t("navbar.title")}
              </h2>
              <p className="text-xs text-gray-600">{t("navbar.subtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu Links */}
        <div className="flex flex-col p-4 sm:p-6 space-y-2">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 sm:space-x-4 px-4 sm:px-5 py-3 sm:py-4 text-gray-700 hover:text-green-600 hover:bg-white rounded-2xl font-semibold transition-all duration-300 transform ${isRTL ? 'hover:-translate-x-2' : 'hover:translate-x-2'} hover:shadow-md`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: isMobileMenuOpen ? 'slideInLeft 0.5s ease-out forwards' : 'none',
                  opacity: 0
                }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="flex-1 text-sm sm:text-base">{link.name}</span>
                {isRTL ? (
                  <FiChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                ) : (
                  <FiChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                )}
              </Link>
            );
          })}
          
          {/* Language Switcher Mobile */}
          <div className="py-3 sm:py-4 px-2">
            <LanguageSwitcher mobile={true} />
          </div>
          
          {/* Mobile Auth Section */}
          <div className="pt-4 sm:pt-6 border-t-2 border-green-200 mt-4">
            {user ? (
              <div className="space-y-4">
                <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4 px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl`}>
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center ring-2 ring-green-300 ring-offset-2 shadow-lg">
                      <span className="text-white font-bold text-lg sm:text-xl">
                        {user.name?.charAt(0).toUpperCase() || t("navbar.user").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-bold text-base sm:text-lg truncate">
                      {user.name || t("navbar.user")}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {user.email || ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="group w-full flex items-center justify-center space-x-2 sm:space-x-3 px-5 py-4 sm:py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <FiLogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-sm sm:text-base">{t("navbar.logout")}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex items-center justify-center space-x-2 sm:space-x-3 w-full px-6 py-4 sm:py-5 bg-gradient-to-r from-green-600 via-green-700 to-green-600 text-white text-center rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-500 font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] overflow-hidden relative"
              >
                <FiUser className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                <span className="text-sm sm:text-base relative z-10">{t("navbar.login")}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Espace pour compenser la navbar fixe */}
      <div className="h-14 sm:h-16 lg:h-20"></div>

      {/* Styles animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }

        .bg-size-200 {
          background-size: 200% auto;
        }

        .bg-pos-0 {
          background-position: 0% center;
        }

        .bg-pos-100:hover {
          background-position: 100% center;
        }
      `}</style>
    </>
  );
};

export default Navbar;