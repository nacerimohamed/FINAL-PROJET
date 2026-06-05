import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CooperativeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="w-full md:w-64 bg-green-800 text-white flex flex-col min-h-screen md:h-screen md:sticky top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          Coopérative
        </h2>
      </div>
      <nav className="mt-2 flex-1">
        <Link 
          to="/cooperative/dashboard" 
          className={`block px-6 py-3 transition ${location.pathname === '/cooperative/dashboard' ? 'bg-green-900 border-l-4 border-green-400' : 'hover:bg-green-700'}`}
        >
          Tableau de bord
        </Link>
        <Link 
          to="/cooperative/products" 
          className={`block px-6 py-3 transition ${location.pathname.includes('/cooperative/products') ? 'bg-green-900 border-l-4 border-green-400' : 'hover:bg-green-700'}`}
        >
          Mes Produits
        </Link>
      </nav>
      <div className="p-4 border-t border-green-700 mt-auto">
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default CooperativeSidebar;
