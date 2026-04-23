import React, { useEffect, useState } from "react";
import axios from "axios";
import ManagerSidebar from "./ManagerSidebar";

const ManagerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    axios
      .get(`${API_URL}/api/manager/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        // Si le backend renvoie des statistiques
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement du dashboard:", err);
        alert("Erreur lors du chargement du dashboard");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, API_URL]);

  // Obtenir l'initial du nom pour l'avatar
  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "M";
  };

  // Obtenir la date formatée
  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <ManagerSidebar />
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-green-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-4 text-sm sm:text-base text-gray-600 font-medium">
              Chargement de votre espace manager...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <ManagerSidebar />
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 max-w-md w-full text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Session expirée
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Veuillez vous reconnecter pour accéder à votre espace manager
            </p>
            <a
              href="/login"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ManagerSidebar />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* En-tête responsive avec bienvenue */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">
                    {getInitial()}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                  Bonjour, {user.name?.split(' ')[0] || 'Manager'} !
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {getFormattedDate()}
                </p>
              </div>
            </div>
            
            {/* Badge manager responsive */}
            <div className="flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-700 rounded-full shadow-lg self-start sm:self-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-white font-semibold text-xs sm:text-sm">
                Manager
              </span>
            </div>
          </div>

          {/* Cartes de statistiques */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
              {/* Produits */}
              <div className="group bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Produits</h2>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.products || 0}</p>
              </div>

              {/* Commandes */}
              <div className="group bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Commandes</h2>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.orders || 0}</p>
              </div>

              {/* Coopérative */}
              <div className="group bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Ma coopérative</h2>
                <p className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                  {user.cooperative_name || "Non assignée"}
                </p>
              </div>
            </div>
          )}

          {/* Grille d'informations responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Carte profil principale */}
            <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-green-600 px-4 sm:px-6 py-4 sm:py-5">
                <h2 className="text-white font-semibold text-base sm:text-lg flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Informations personnelles
                </h2>
              </div>
              
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500">Nom complet</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-800 break-words">
                      {user.name}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-800 break-words">
                      {user.email}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500">Adresse</p>
                    <p className="text-sm sm:text-base text-gray-600 break-words">
                      {user.address || (
                        <span className="text-gray-400 italic">Non définie</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500">Téléphone</p>
                    <p className="text-sm sm:text-base text-gray-600 break-words">
                      {user.phone || (
                        <span className="text-gray-400 italic">Non renseigné</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500">Rôle</p>
                    <div>
                      <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                        Manager
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500">Membre depuis</p>
                    <p className="text-sm sm:text-base text-gray-600">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Nouveau'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte actions rapides */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-green-600 px-4 sm:px-6 py-4 sm:py-5">
                <h2 className="text-white font-semibold text-base sm:text-lg flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Actions rapides
                </h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  <a
                    href="/manager/products"
                    className="group flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-600 transition-colors duration-300">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-green-700">
                        Gérer les produits
                      </span>
                    </div>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                
                </div>
              </div>
            </div>
          </div>

          {/* Section activité récente */}
          <div className="mt-6 lg:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-green-700 to-green-600 px-4 sm:px-6 py-4 sm:py-5">
              <h2 className="text-white font-semibold text-base sm:text-lg flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Activité récente
              </h2>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-gray-800">Connexion réussie</p>
                      <p className="text-xs sm:text-sm text-gray-500">Aujourd'hui</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-green-600 font-medium self-end sm:self-auto">
                    Maintenant
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                  </div>
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;