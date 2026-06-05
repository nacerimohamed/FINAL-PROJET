import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import CooperativeSidebar from './CooperativeSidebar';

// Plan product limits (must match backend)
const PLAN_LIMITS = {
  gratuit: 1,
  standard: 5,
  premium: 15,
  professionnel: Infinity
};

const CooperativeProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const userPlan = user.plan || 'gratuit';
  const planLimit = PLAN_LIMITS[userPlan] || PLAN_LIMITS.gratuit;
  const isLimitReached = planLimit !== Infinity && products.length >= planLimit;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/cooperative/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://127.0.0.1:8000/api/cooperative/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Produit supprimé avec succès!');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar for Cooperative */}
      <CooperativeSidebar />

      <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Section - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Gestion des Produits
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-500">
                Gérez le catalogue de votre coopérative
              </p>
              
              {/* Plan Info Badge - Responsive */}
              <div className="inline-flex flex-wrap items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Plan: <strong className="uppercase">{userPlan}</strong>
                </span>
                <span className="text-blue-300">|</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Produits: <strong>{products.length} / {planLimit === Infinity ? '∞' : planLimit}</strong>
                </span>
              </div>
            </div>
            
            <Link
              to="/cooperative/products/add"
              className={`
                inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base
                transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md
                ${isLimitReached 
                  ? 'bg-gray-300 cursor-not-allowed pointer-events-none opacity-60' 
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-200'
                }
              `}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un produit
            </Link>
          </div>
          
          {/* Warning Alert - Responsive */}
          {isLimitReached && (
            <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-3 sm:p-4 rounded-r-xl shadow-sm animate-pulse">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-amber-700">
                    <strong className="font-semibold">Limite atteinte !</strong> Vous avez atteint la limite de <strong>{planLimit} produits</strong> de votre forfait <strong className="uppercase">{userPlan}</strong>.
                    Pour ajouter plus de produits, veuillez contacter l'administrateur.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Products Display - Responsive Grid/Cards */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
                <div className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-20 h-10 w-10 sm:h-12 sm:w-12"></div>
              </div>
              <p className="text-sm sm:text-base text-gray-500 mt-4 animate-pulse">Chargement des produits...</p>
            </div>
          ) : products.length === 0 ? (
            /* Empty State - Responsive */
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-12 text-center border border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Aucun produit</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">Commencez par ajouter votre premier produit</p>
              {!isLimitReached && (
                <Link
                  to="/cooperative/products/add"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all font-semibold text-sm sm:text-base shadow-md"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter un produit
                </Link>
              )}
            </div>
          ) : (
            /* Products Grid - Responsive Cards (Unified for all screen sizes) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-1"
                  style={{ animation: `fadeInUp 0.3s ease-out ${index * 50}ms both` }}
                >
                  {/* Image Section */}
                  <div className="relative h-36 sm:h-40 md:h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <img
                      src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                    />
                    {/* Stock Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`
                        inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold shadow-md
                        ${product.quantity > 10 
                          ? 'bg-green-500 text-white' 
                          : product.quantity > 0 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-red-500 text-white'
                        }
                      `}>
                        <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {product.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-[11px] sm:text-xs mt-1 line-clamp-2">
                      {product.description || 'Aucune description'}
                    </p>
                    
                    {/* Price */}
                    <div className="mt-2 sm:mt-3">
                      <span className="inline-block text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">
                        {product.price}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500"> DH</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 sm:mt-4">
                      <Link
                        to={`/cooperative/products/edit/${product.id}`}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all text-center flex items-center justify-center gap-1 shadow-md"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1 shadow-md"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CooperativeProducts;