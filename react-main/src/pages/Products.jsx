import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FaSearch, 
  FaWhatsapp, 
  FaRegImage, 
  FaRedo, 
  FaBoxes, 
  FaEye, 
  FaStore, 
  FaTag,
  FaLeaf
} from "react-icons/fa";
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
    product.image || "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";

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
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50/30">
          <div className="relative flex items-center justify-center">
            <div className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-emerald-500 opacity-20" />
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-100 border-t-emerald-600" />
          </div>
          <p className="text-emerald-800 font-semibold tracking-wide mt-4 animate-pulse text-sm">
            {t('products.loading')}
          </p>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-green-50/30 px-4">
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-xl max-w-md w-full text-center transform scaleUp">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
            <p className="text-gray-800 font-bold text-lg mb-2">{t('products.errorTitle' || "Erreur")}</p>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{error}</p>
            <button
              onClick={fetchProducts}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-md shadow-emerald-600/10 active:scale-95 transition-all font-semibold text-sm"
            >
              <FaRedo className="text-xs" /> {t('common.retry')}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 overflow-hidden py-5 border-b-4 border-emerald-500">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 mb-4 animate-fade-in">
            <FaLeaf className="text-[10px] text-emerald-400" />
            Produits Terroirs
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl mx-auto drop-shadow-sm">
            {t('products.title')}
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 max-w-xl mx-auto font-medium">
            {t('products.subtitle')}
          </p>
        </div>
      </div>

      {/* Search Bar section */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-4">
        <div className="relative w-full md:w-1/2 lg:w-1/3 mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600">
            <FaSearch className="text-sm" />
          </div>
          <input
            type="text"
            placeholder={t('products.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-emerald-200 rounded-full pl-11 pr-4 py-3 text-sm font-medium shadow-sm transition-all outline-none bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 placeholder-gray-400 text-gray-700"
          />
        </div>
      </div>

      {/* Products Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-[400px]">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100 shadow-sm max-w-lg mx-auto p-8 transform scaleUp">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <FaSearch />
            </div>
            <p className="text-gray-600 text-lg font-bold">{t('products.noResults')}</p>
            <p className="text-gray-400 text-xs mt-1">Essayer d'entrer un autre nom de produit.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                /* 🔹 زدنا الكلاس product-card-animate باش نتحكمو ف الـ opacity الأولية */
                className="product-card-animate group bg-white rounded-2xl border border-emerald-100/60 shadow-sm overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full"
                /* 🔹 كبرنا الـ delay لـ i * 80ms باش يبان التأثير ديال واحد بواحد بوضوح */
                style={{ animation: `fadeUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${i * 80}ms both` }}
              >
                {/* Image Wrapper */}
                <div className="relative h-52 w-full overflow-hidden bg-emerald-50/50 flex items-center justify-center border-b border-emerald-50">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";
                    }}
                  />

                  {/* Floating Price Tag */}
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-md border border-white/10">
                    <FaTag className="text-[10px] text-emerald-200" />
                    <span>{product.price} DH</span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>

                    {product.description ? (
                      <p className="text-gray-500 line-clamp-2 text-xs leading-relaxed">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-gray-300 italic text-[11px]">Aucune description disponible</p>
                    )}
                  </div>

                  {/* Cooperative Tag Block */}
                  <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50 flex items-start gap-2.5">
                    <FaStore className="text-emerald-600 text-xs mt-0.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{t('products.cooperative')}</p>
                      <p className="text-xs font-bold text-emerald-800 line-clamp-1">
                        {product.cooperative?.name || t('products.unspecified')}
                      </p>
                    </div>
                  </div>

                  {/* Actions Block */}
                  <div className="mt-auto space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs border-b border-emerald-50/60 pb-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors border border-emerald-200/40"
                      >
                        <FaEye className="text-[11px]" />
                        {t('products.viewDetails')}
                      </Link>
                    </div>

                    {(product.cooperative?.whatsapp || product.cooperative?.phone) && (
                      <button
                        onClick={() => handleWhatsAppClick(product)}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98]"
                      >
                        <FaWhatsapp className="text-base animate-bounce-slow" />
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

      {/* Embedded Animations Style */}
      <style>{`
        /* 🔹 رجعنا الكارطة كتكون مخفية ف الأول opacity: 0 باش يبان الـ effect نقي */
        .product-card-animate {
          opacity: 0;
          will-change: transform, opacity;
        }

        @keyframes fadeUp { 
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0); 
          } 
        }
        .scaleUp {
          animation: scaleUpKey 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes scaleUpKey {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Products;