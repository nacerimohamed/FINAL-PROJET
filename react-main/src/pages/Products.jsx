import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/products");
      if (response.data.success) setProducts(response.data.data);
    } catch (err) {
      setError(t('products.error'));
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) =>
    product.image || "https://via.placeholder.com/300x200/16a34a/ffffff?text=Produit";

  const handleWhatsAppClick = (product) => {
    const phone = product.cooperative?.whatsapp || product.cooperative?.phone;
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      const message = encodeURIComponent(t('products.whatsappMessage', { productName: product.name }));
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
    } else alert(t('products.noWhatsApp'));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-green-200">
          <div className="text-center">
            <div className="h-16 w-16 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto shadow-lg"></div>
            <p className="mt-4 text-green-700 text-lg font-medium">{t('products.loading')}</p>
          </div>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-green-50">
          <div className="bg-white shadow-2xl rounded-2xl p-10 text-center border border-green-200">
            <p className="text-green-600 text-xl mb-6 font-semibold">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl transition font-semibold shadow-md"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white py-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">{t('products.title')}</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative w-full md:w-1/2 lg:w-1/3 mx-auto">
          <input
            type="text"
            placeholder={t('products.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 placeholder-gray-400 text-gray-700 transition"
          />
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-16 bg-green-50">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-green-600 text-xl">{t('products.noResults')}</p>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-500 overflow-hidden border border-green-200 group transform hover:-translate-y-1 hover:scale-105"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200/16a34a/ffffff?text=Produit";
                    }}
                  />

                  <div className="absolute top-3 right-3 bg-green-600 hover:bg-green-700 text-amber-50 px-2.5 py-1 rounded-md text-xs font-medium">
                        {product.price} DH
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-green-700 mb-2 group-hover:text-green-900 transition">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-green-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  )}

                  <div className="mb-4 bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-xs text-green-500 uppercase">{t('products.cooperative')}</p>
                    <p className="text-green-700 font-semibold">
                      {product.cooperative?.name || t('products.unspecified')}
                    </p>
                  </div>

                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between items-center border-t border-green-100 pt-2">
                      <span className="text-sm text-green-600">
                        {t('products.stock')}:
                        <span className="font-semibold text-green-700 ml-1">{product.quantity}</span>
                      </span>

                      <Link
                        to={`/products/${product.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md"
                      >
                        {t('products.viewDetails')}
                      </Link>
                    </div>

                    {(product.cooperative?.whatsapp || product.cooperative?.phone) && (
                      <button
                        onClick={() => handleWhatsAppClick(product)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
                      >
                        {t('products.buyOnWhatsApp')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Products;