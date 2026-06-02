import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  FiChevronLeft,
  FiLayout
} from "react-icons/fi";

// Logo image import
import logoImage from "./image.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur:", error);
        localStorage.removeItem("user");
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

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

  // 🔹 دالة لتحديد رابط الـ Dashboard على حسب الـ Role
  const getDashboardPath = () => {
    if (!user) return "/";
    const role = user.role?.toLowerCase();
    if (role === "admin") return "/admin/dashboard";
    if (role === "manager" || role === "cooperative") return "/manager/dashboard";
    return "/";
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
        className={`fixed w-full top-0 left-0 z-40 transition-all duration-500 ${isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg py-1"
          : "bg-white shadow-md py-2"
          }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo Section */}
            <Link
              to="/"
              className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 group flex-shrink-0 relative`}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 to-amber-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="relative">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden shadow-lg ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/60 transition-all duration-300 bg-gradient-to-br from-emerald-100 to-amber-100">
                  <img
                    src={logoImage}
                    alt="AgriMarket Logo"
                    className="w-full h-full object-cover scale-[1.25] transition-all duration-500 group-hover:scale-[1.35] group-hover:rotate-6"
                  />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-ping opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                <div className="absolute -inset-1 rounded-full border border-emerald-400/30 animate-spin-slow opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </div>

              <div className="flex flex-col overflow-hidden">
                <div className="flex items-center">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
                    <span className="text-emerald-600 inline-block transition-all duration-300 group-hover:scale-105 origin-left">Agri</span>
                    <span className="text-amber-500 inline-block transition-all duration-300 group-hover:scale-105 origin-left delay-75">Market</span>
                  </h1>
                </div>
                <p className="hidden sm:block text-[10px] md:text-xs text-slate-400 font-bold tracking-wider mt-0.5 animate-fadeIn">
                  {t("navbar.subtitle") || "🌱 Produits locaux & Bio"}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className={`hidden lg:flex items-center gap-1`}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActivePath(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 group rounded-xl whitespace-nowrap ${
                      active
                        ? 'text-green-700 bg-green-100/80'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    <span>{link.name}</span>
                    {active && <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse shrink-0"></span>}
                    <span className={`absolute bottom-0 ${isRTL ? 'right-3' : 'left-3'} h-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-500 ${
                      active ? 'w-[calc(100%-1.5rem)]' : 'w-0 group-hover:w-[calc(100%-1.5rem)]'
                    }`}></span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Action Right Block */}
            <div className={`hidden lg:flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 flex-shrink-0`}>
              <LanguageSwitcher />

              {user ? (
                <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 animate-fadeIn`}>
                  {/* 🔹 رجعنا هاد الجزء عبارة عن Link قابل للضغط كيدي لـ Dashboard */}
                  <Link
                    to={getDashboardPath()}
                    title="Accéder au tableau de bord"
                    className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 via-teal-50/30 to-emerald-100/50 hover:from-emerald-100 hover:to-emerald-200 px-3 h-9 rounded-xl border border-emerald-300 shadow-sm transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 group/user"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center shadow-md relative overflow-hidden group-hover/user:scale-105 transition-transform">
                      <span className="text-white text-sm font-bold group-hover/user:hidden">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                      <FiLayout className="text-white text-sm hidden group-hover/user:block" />
                    </div>
                    <span className="text-slate-800 font-extrabold text-xs max-w-[140px] truncate">
                      {user.name || t("navbar.user")}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="group flex items-center space-x-1.5 px-4 h-9 bg-gradient-to-r from-yellow-500/90 to-lime-500/90 hover:from-yellow-400 hover:to-lime-400 text-white rounded-xl transition-all font-bold text-xs shadow-sm active:scale-95 hover:shadow-md relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    <FiLogOut className="relative z-10" />
                    <span className="relative z-10">{t("navbar.logout")}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl transition-all font-bold text-sm shadow-md hover:shadow-lg active:scale-95"
                >
                  <FiUser className="text-base" />
                  <span>{t("navbar.login")}</span>
                </Link>
              )}
            </div>

            {/* Mobile Burger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all relative z-50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-slate-800" />
              ) : (
                <FiMenu className="w-6 h-6 text-slate-800" />
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Sidebar & Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-[300px] bg-white z-50 shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/30 to-transparent">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md ring-2 ring-emerald-500/30">
              <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-black">
                <span className="text-emerald-600">Agri</span>
                <span className="text-amber-500">Market</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-bold">Produits locaux</p>
            </div>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col p-5 space-y-2">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            const active = isActivePath(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 sm:space-x-4 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 transform ${isRTL ? 'hover:-translate-x-2' : 'hover:translate-x-2'} hover:shadow-md ${active
                  ? 'text-green-700 bg-white shadow-md border-l-4 border-green-600'
                  : 'text-gray-700 hover:text-green-600 hover:bg-white'
                  }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isMobileMenuOpen ? 'slideInLeft 0.5s ease-out forwards' : 'none',
                  opacity: 0
                }}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${active
                  ? 'bg-gradient-to-br from-green-600 to-green-700 scale-110 rotate-6'
                  : 'bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-600 group-hover:to-green-700 group-hover:scale-110 group-hover:rotate-6'
                  }`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${active ? 'text-white' : 'text-green-700 group-hover:text-white'}`} />
                </div>
                <span className="flex-1 text-sm sm:text-base">{link.name}</span>
                {active && <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>}
                {!active && (isRTL ? (
                  <FiChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300" />
                ) : (
                  <FiChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                ))}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-gray-100 mt-2 px-2">
            <LanguageSwitcher mobile={true} />
          </div>

          <div className="pt-4 border-t border-gray-100 mt-2">
            {user ? (
              <div className="space-y-3 p-2">
                {/* 🔹 حتى فـ Mobile رجعناه Link كيدي لـ Dashboard */}
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-amber-50/50 p-3 rounded-xl border border-emerald-200 hover:border-emerald-400 transition-colors block"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Mon Dashboard ↗</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="group w-full flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-yellow-500/90 to-lime-500/90 hover:from-yellow-400 hover:to-lime-400 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <FiLogOut className="relative z-10" />
                  <span className="relative z-10">{t("navbar.logout")}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <FiUser />
                <span>{t("navbar.login")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to avoid layout shifting */}
      <div className="h-16 md:h-20" />

      {/* Styles animations */}
      <style>{`
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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Navbar;