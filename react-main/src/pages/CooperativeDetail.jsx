import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaWhatsapp, FaBuilding, FaBox, FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const CooperativeDetail = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { id } = useParams();
  const navigate = useNavigate();
  const [cooperative, setCooperative] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchCooperativeDetails();
    fetchCooperativeProducts();
  }, [id]);

  const fetchCooperativeDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/cooperatives/${id}`);
      if (response.data.success) {
        setCooperative(response.data.data);
      }
    } catch (err) {
      setError(t('cooperativeDetail.error'));
      console.error("Error fetching cooperative:", err);
    }
  };

  const fetchCooperativeProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/cooperatives/${id}/products`);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCooperativeImage = (coop) => {
    if (imageError) return null;
    if (coop?.image) {
      if (coop.image.startsWith('uploads/')) {
        return `http://localhost:8000/${coop.image}`;
      }
      if (coop.image.startsWith('http')) {
        return coop.image;
      }
      return `http://localhost:8000/uploads/${coop.image}`;
    }
    return null;
  };

  const getProductImage = (product) => {
    if (product?.image) {
      if (product.image.startsWith('http')) {
        return product.image;
      }
      if (product.image.startsWith('uploads/')) {
        return `http://localhost:8000/${product.image}`;
      }
      return `http://localhost:8000/uploads/${product.image}`;
    }
    return null;
  };

  const handleWhatsAppClick = () => {
    const phone = cooperative?.whatsapp || cooperative?.tele;
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      const message = encodeURIComponent(t('cooperativeDetail.whatsappMessage'));
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    } else {
      alert(t('cooperativeDetail.noWhatsApp'));
    }
  };

  const handleEmailClick = () => {
    if (cooperative?.email) {
      window.location.href = `mailto:${cooperative.email}`;
    }
  };

  const handlePhoneClick = () => {
    if (cooperative?.tele) {
      window.location.href = `tel:${cooperative.tele}`;
    }
  };

  const handleSocialClick = (platform, url) => {
    if (url) {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -10,
      boxShadow: "0 25px 40px -12px rgba(0,0,0,0.15)",
      transition: { type: "spring", stiffness: 300, damping: 15 }
    },
    tap: { scale: 0.98 }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-stone-50" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16 border-4 border-emerald-200 border-t-emerald-700 rounded-full mx-auto"
            />
            <p className="mt-6 text-stone-500 text-lg">{t('cooperativeDetail.loading')}</p>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !cooperative) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-stone-50" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-10 text-center shadow-lg border border-stone-200"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-stone-600 mb-6">{error || t('cooperativeDetail.notFound')}</p>
            <button
              onClick={() => navigate('/cooperatives')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl transition text-sm font-medium"
            >
              {t('cooperativeDetail.backToCooperatives')}
            </button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  const cooperativeImage = getCooperativeImage(cooperative);
  const hasImage = cooperativeImage !== null;

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-stone-100 py-4 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Link to="/" className="hover:text-emerald-700 transition">Accueil</Link>
            <span>/</span>
            <Link to="/cooperatives" className="hover:text-emerald-700 transition">Coopératives</Link>
            <span>/</span>
            <span className="text-emerald-700 font-medium">{cooperative?.nom}</span>
          </div>
        </div>
      </div>

      {/* Hero Section - Version avec image complète */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-800 text-amber-50"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Image - Pleine et complète */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-2 md:order-1"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
                {hasImage ? (
                  <img
                    src={cooperativeImage}
                    alt={cooperative.nom}
                    className="w-full h-auto max-h-[400px] object-contain bg-gradient-to-br from-stone-100 to-stone-200"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-80 flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                    <FaBuilding className="w-20 h-20 text-stone-400 mb-4" />
                    <p className="text-stone-500 font-medium">Image non disponible</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <div className="order-1 md:order-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="inline-block mb-6"
              >
                <div className="bg-amber-50/20 backdrop-blur-sm rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto md:mx-0 border border-amber-100/30">
                  <FaBuilding className="w-8 h-8 text-amber-50" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                {cooperative.nom}
              </motion.h1>
              
              {cooperative.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-amber-100/90 text-lg mb-6 leading-relaxed"
                >
                  {cooperative.description}
                </motion.p>
              )}
              
              {/* Contact Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {(cooperative.whatsapp || cooperative.tele) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWhatsAppClick}
                    className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-2.5 px-5 rounded-xl transition shadow-md"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    {t('cooperativeDetail.whatsapp')}
                  </motion.button>
                )}
                {cooperative.email && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEmailClick}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-2.5 px-5 rounded-xl transition"
                  >
                    <FaEnvelope className="w-5 h-5" />
                    {t('cooperativeDetail.email')}
                  </motion.button>
                )}
                {cooperative.tele && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePhoneClick}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-2.5 px-5 rounded-xl transition"
                  >
                    <FaPhone className="w-5 h-5" />
                    {t('cooperativeDetail.call')}
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Details Section */}
      <div className="bg-stone-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 bg-white rounded-2xl shadow-md border border-stone-200 p-6"
            >
              <h2 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FaBuilding className="w-4 h-4 text-emerald-700" />
                </div>
                {t('cooperativeDetail.contactInfo')}
              </h2>
              
              <div className="space-y-5">
                {cooperative.adresse && (
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FaMapMarkerAlt className="text-emerald-600 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-semibold text-stone-700 text-sm mb-1">{t('cooperativeDetail.address')}</p>
                      <p className="text-stone-600">{cooperative.adresse}</p>
                    </div>
                  </div>
                )}

                {cooperative.email && (
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FaEnvelope className="text-emerald-600 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-semibold text-stone-700 text-sm mb-1">{t('cooperativeDetail.email')}</p>
                      <a href={`mailto:${cooperative.email}`} className="text-emerald-700 hover:underline">
                        {cooperative.email}
                      </a>
                    </div>
                  </div>
                )}

                {cooperative.tele && (
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <FaPhone className="text-emerald-600 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-semibold text-stone-700 text-sm mb-1">{t('cooperativeDetail.phone')}</p>
                      <a href={`tel:${cooperative.tele}`} className="text-emerald-700 hover:underline">
                        {cooperative.tele}
                      </a>
                    </div>
                  </div>
                )}

                {cooperative.contact && (
                  <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <svg className="w-5 h-5 text-emerald-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-stone-700 text-sm mb-1">{t('cooperativeDetail.contactPerson')}</p>
                      <p className="text-stone-600">{cooperative.contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-md border border-stone-200 p-6"
            >
              <h2 className="text-2xl font-bold text-stone-800 mb-6">{t('cooperativeDetail.socialMedia')}</h2>
              
              <div className="space-y-3">
                {cooperative.facebook && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSocialClick('facebook', cooperative.facebook)}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md"
                  >
                    <FaFacebook className="w-5 h-5" />
                    Facebook
                  </motion.button>
                )}

                {cooperative.instagram && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSocialClick('instagram', cooperative.instagram)}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md"
                  >
                    <FaInstagram className="w-5 h-5" />
                    Instagram
                  </motion.button>
                )}

                {(cooperative.whatsapp || cooperative.tele) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsAppClick}
                    className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition shadow-md"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    WhatsApp
                  </motion.button>
                )}

                {!cooperative.facebook && !cooperative.instagram && !cooperative.whatsapp && (
                  <p className="text-stone-500 text-center py-8">{t('cooperativeDetail.noSocialMedia')}</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-stone-800 flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FaBox className="w-5 h-5 text-emerald-700" />
                </div>
                {t('cooperativeDetail.productsOf', { cooperativeName: cooperative.nom })}
              </h2>
              <span className="text-sm text-stone-500 bg-white px-3 py-1 rounded-full shadow-sm">
                {products.length} produit{products.length > 1 ? 's' : ''}
              </span>
            </div>

            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-2xl border border-stone-200"
              >
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBox size={32} className="text-stone-400" />
                </div>
                <p className="text-stone-600 text-xl">{t('cooperativeDetail.noProducts')}</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {products.map((product) => {
                  const productImage = getProductImage(product);
                  const hasProductImage = productImage !== null;
                  return (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      {...cardVariants}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <Link
                        to={`/products/${product.id}`}
                        className="block bg-white rounded-2xl overflow-hidden shadow-md border border-stone-200 group"
                      >
                        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
                          {hasProductImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                              className="w-full h-full object-contain p-4"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/400x300/065f46/fef3c7?text=Produit";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <FaBox className="w-12 h-12 text-stone-400 mb-2" />
                              <p className="text-stone-500 text-sm">Image non disponible</p>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-bold text-emerald-800 shadow-lg">
                            {product.price} DH
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                              product.quantity > 0 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {product.quantity > 0 ? `Stock: ${product.quantity}` : 'Rupture'}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-emerald-700 transition line-clamp-1">
                            {product.name}
                          </h3>
                          
                          {product.description && (
                            <p className="text-stone-500 text-sm mb-4 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                            <div className="text-sm text-stone-500">
                              {t('productDetail.stock')}: <span className="font-semibold text-stone-700">{product.quantity}</span>
                            </div>
                            <span className="text-emerald-600 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              {t('productDetail.viewDetails')} →
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CooperativeDetail;