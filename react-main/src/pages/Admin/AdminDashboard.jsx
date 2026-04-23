// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { Link } from "react-router-dom";
import RegionMap from "./RegionMap";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 3;
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
        alert("Impossible de récupérer les données du dashboard admin");
      }
    };

    const fetchRecentMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await axios.get("http://127.0.0.1:8000/api/admin/contacts/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setRecentMessages(res.data.data);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Erreur messages récents:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchStats();
    fetchRecentMessages();
  }, [token]);

  const markAsRead = async (messageId) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/contacts/${messageId}/mark-as-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setRecentMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === messageId ? { ...msg, status: 'lu' } : msg
          )
        );
      }
    } catch (err) {
      console.error("Erreur lors du marquage:", err);
    }
  };

  if (!stats) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center min-h-screen bg-stone-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone-300 border-t-emerald-700 mx-auto mb-3"></div>
            <p className="text-stone-500 text-sm">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = recentMessages.filter(msg => msg.status === 'non lu').length;

  // Pagination calculations
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = recentMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(recentMessages.length / messagesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const statsCards = [
    {
      title: "Total Utilisateurs",
      value: stats.total_users,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "emerald"
    },
    {
      title: "Administrateurs",
      value: stats.admins,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "stone"
    },
    {
      title: "Gestionnaires",
      value: stats.manager,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "amber"
    }
  ];

  const getColorClasses = (color) => {
    switch(color) {
      case 'emerald':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'hover:border-emerald-200' };
      case 'stone':
        return { bg: 'bg-stone-100', text: 'text-stone-700', border: 'hover:border-stone-300' };
      case 'amber':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'hover:border-amber-200' };
      default:
        return { bg: 'bg-stone-50', text: 'text-stone-700', border: 'hover:border-stone-200' };
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-light text-stone-800">Dashboard Admin</h1>
          <p className="text-stone-500 text-sm mt-1">Bienvenue dans votre espace d'administration</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {statsCards.map((card, index) => {
            const colors = getColorClasses(card.color);
            return (
              <div
                key={card.title}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white p-5 rounded-xl border border-stone-200 transition-all duration-300 hover:shadow-md ${colors.border} transform hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide">{card.title}</p>
                    <p className="text-2xl font-semibold text-stone-800 mt-1">{card.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center transition-all duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
                    <div className={colors.text}>{card.icon}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Region Map */}
        <RegionMap />

        {/* SECTION CONTACT MESSAGES AVEC PAGINATION */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden mt-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 bg-gradient-to-r from-white to-stone-50/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-stone-800 text-base">Messages de contact</h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Page {currentPage} sur {totalPages || 1} • {recentMessages.length} message{recentMessages.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-700">
                      {unreadCount} non{unreadCount > 1 ? 's' : ''} lu{unreadCount > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                
              </div>
            </div>
          </div>

          {/* Liste des messages */}
          <div className="divide-y divide-stone-50">
            {loadingMessages ? (
              <div className="px-6 py-12 text-center">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-200 border-t-emerald-600 mx-auto mb-3"></div>
                  <p className="text-xs text-stone-400">Chargement des messages...</p>
                </div>
              </div>
            ) : recentMessages.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-sm text-stone-500 font-medium">Aucun message</p>
                <p className="text-xs text-stone-400 mt-1">Les nouveaux messages apparaîtront ici</p>
              </div>
            ) : (
              currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`group relative px-6 py-4 transition-all duration-300 hover:bg-stone-50/80 ${
                    message.status === 'non lu' ? 'bg-emerald-50/20' : ''
                  }`}
                >
                  {message.status === 'non lu' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-r-full"></div>
                  )}
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 flex items-start gap-3">
                      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium shadow-sm ${
                        message.status === 'non lu'
                          ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}>
                        {message.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`font-medium text-sm ${
                            message.status === 'non lu' ? 'text-stone-800' : 'text-stone-600'
                          }`}>
                            {message.name}
                          </span>
                          {message.status === 'non lu' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                              Nouveau
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1.5 mb-2">
                          <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-stone-500 truncate">{message.email}</p>
                        </div>
                        
                        <p className={`text-sm leading-relaxed line-clamp-2 ${
                          message.status === 'non lu' ? 'text-stone-700' : 'text-stone-500'
                        }`}>
                          "{message.message}"
                        </p>
                        
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-stone-400">
                            {new Date(message.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => markAsRead(message.id)}
                      disabled={message.status !== 'non lu'}
                      className={`flex-shrink-0 p-2 rounded-xl transition-all duration-200 ${
                        message.status === 'non lu'
                          ? 'text-emerald-600 hover:bg-emerald-50 hover:scale-105 active:scale-95'
                          : 'text-stone-300 cursor-not-allowed'
                      }`}
                      title="Marquer comme lu"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION - AFFICHÉE SEULEMENT SI PLUS DE 3 MESSAGES */}
          {recentMessages.length > messagesPerPage && (
            <div className="px-6 py-4 bg-stone-50/50 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === 1
                      ? 'text-stone-300 cursor-not-allowed'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-emerald-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Précédent
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === number
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-stone-600 hover:bg-stone-100 hover:text-emerald-600'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === totalPages
                      ? 'text-stone-300 cursor-not-allowed'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-emerald-600'
                  }`}
                >
                  Suivant
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Footer avec statistiques */}
          {recentMessages.length > 0 && (
            <div className="px-6 py-3 bg-stone-50/30 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Total: {recentMessages.length} messages</span>
                  </div>
                  <div className="w-px h-3 bg-stone-200"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>{unreadCount} non lus</span>
                  </div>
                </div>
                <div className="text-stone-400">
                  Page {currentPage} / {totalPages}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;