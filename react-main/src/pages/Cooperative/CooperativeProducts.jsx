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
      const response = await axios.get('http://localhost:8000/api/cooperative/products', {
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
      const response = await axios.delete(`http://localhost:8000/api/cooperative/products/${id}`, {
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar for Cooperative */}
      <CooperativeSidebar />

      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Produits</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Gérez le catalogue de votre coopérative</p>
              
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Plan actuel: <strong className="ml-1 uppercase">{userPlan}</strong> 
                <span className="mx-2">|</span>
                Produits: <strong className="ml-1">{products.length} / {planLimit === Infinity ? 'Illimité' : planLimit}</strong>
              </div>
            </div>
            <Link
              to="/cooperative/products/add"
              className={`w-full sm:w-auto text-white font-semibold py-2.5 px-4 md:py-3 md:px-6 rounded-lg transition shadow-md text-sm md:text-base text-center flex items-center justify-center ${
                isLimitReached ? 'bg-gray-400 cursor-not-allowed pointer-events-none' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              + Ajouter un produit
            </Link>
          </div>
          
          {isLimitReached && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Vous avez atteint la limite de <strong>{planLimit} produits</strong> de votre forfait <strong>{userPlan}</strong>.
                    Pour ajouter plus de produits, veuillez contacter l'administrateur pour passer à une offre supérieure.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Products Table */}
          {loading ? (
            <div className="text-center py-8 md:py-12">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-sm md:text-base text-gray-600 mt-3 md:mt-4">Chargement des produits...</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-4">
                {products.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
                    <p className="text-gray-500">Aucun produit trouvé. Ajoutez votre premier produit!</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={product.image || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-contain bg-white rounded border border-gray-100"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-800 text-base md:text-lg">{product.name}</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">{product.description?.substring(0, 50)}...</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.quantity > 10
                                ? 'bg-green-100 text-green-800'
                                : product.quantity > 0
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                                }`}>
                                Stock: {product.quantity}
                              </span>
                            </div>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm md:text-base font-semibold text-green-600">
                                {product.price} DH
                              </p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Link
                                to={`/cooperative/products/edit/${product.id}`}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm transition text-center flex items-center justify-center font-medium"
                              >
                                Modifier
                              </Link>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm transition"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Image</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Nom du Produit</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Prix (DH)</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Stock</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-center text-sm md:text-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 md:px-6 py-6 md:py-8 text-center text-gray-500">
                            Aucun produit trouvé. Ajoutez votre premier produit!
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 md:px-6 py-3 md:py-4">
                              <img
                                src={product.image || 'https://via.placeholder.com/100'}
                                alt={product.name}
                                className="w-12 h-12 md:w-16 md:h-16 object-contain bg-white rounded border border-gray-100"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                              />
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                              <div className="font-semibold text-gray-800 text-sm md:text-base">{product.name}</div>
                              <div className="text-xs md:text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-green-600 text-sm md:text-base">
                              {product.price}
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                              <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${product.quantity > 10
                                ? 'bg-green-100 text-green-800'
                                : product.quantity > 0
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                                }`}>
                                {product.quantity}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                              <div className="flex justify-center gap-2">
                                <Link
                                  to={`/cooperative/products/edit/${product.id}`}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-xs md:text-sm transition text-center flex items-center justify-center font-medium"
                                >
                                  Modifier
                                </Link>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-xs md:text-sm transition"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CooperativeProducts;
