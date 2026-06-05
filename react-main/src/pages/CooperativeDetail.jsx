import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaWhatsapp, FaBuilding, FaBox, FaArrowLeft, FaUser, FaCalendarAlt, FaLeaf, FaHandshake, FaShieldAlt, FaExternalLinkAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center text-sm text-slate-500 gap-2">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/cooperatives" className="hover:text-emerald-600 transition-colors">Coopératives</Link>
          <span>/</span>
          <span className="font-medium text-slate-800">{cooperative?.nom}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Header Profile Section */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl shadow-xl border border-emerald-900 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start relative overflow-hidden">
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-bl-full opacity-10 pointer-events-none"></div>

          {/* Logo */}
          <div className="w-28 h-28 md:w-36 md:h-36 shrink-0 border-4 border-white/10 rounded-2xl p-2 bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center z-10">
            {hasImage ? (
              <img src={cooperativeImage} alt={cooperative.nom} className="w-full h-full object-contain rounded-xl bg-white" onError={() => setImageError(true)} />
            ) : (
              <FaBuilding size={48} className="text-emerald-100/50" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col w-full z-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{cooperative.nom}</h1>
                </div>
                <p className="text-emerald-50/80 text-sm md:text-base max-w-2xl leading-relaxed">
                  {cooperative.description || "Aucune description fournie pour le moment."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 shrink-0 mt-2 sm:mt-0">
                {cooperative.whatsapp && (
                  <button onClick={handleWhatsAppClick} className="bg-amber-400 hover:bg-amber-500 text-amber-950 p-2.5 md:px-4 md:py-2.5 rounded-xl transition shadow-md flex items-center gap-2 font-bold text-sm">
                    <FaWhatsapp size={18} />
                    <span className="hidden md:inline">WhatsApp</span>
                  </button>
                )}
                {cooperative.tele && (
                  <button onClick={handlePhoneClick} className="bg-emerald-700 hover:bg-emerald-600 text-white p-2.5 md:px-4 md:py-2.5 rounded-xl transition shadow-md flex items-center gap-2 font-semibold text-sm border border-emerald-600">
                    <FaPhone size={16} />
                    <span className="hidden md:inline">Appeler</span>
                  </button>
                )}
                {cooperative.email && (
                  <button onClick={handleEmailClick} className="bg-emerald-700 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition shadow-md border border-emerald-600" title="Email">
                    <FaEnvelope size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Inline key info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 border-t border-emerald-700/50 pt-5 mt-auto">
              <div className="flex items-center gap-3 text-sm text-emerald-50">
                <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center shrink-0 border border-emerald-700/30">
                  <FaMapMarkerAlt className="text-amber-400" />
                </div>
                <span className="truncate" title={cooperative.adresse}>{cooperative.adresse || "Adresse non renseignée"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-50">
                <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center shrink-0 border border-emerald-700/30">
                  <FaPhone className="text-amber-400" />
                </div>
                <span>{cooperative.tele || "Téléphone non renseigné"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-50">
                <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center shrink-0 border border-emerald-700/30">
                  <FaEnvelope className="text-amber-400" />
                </div>
                <span className="truncate" title={cooperative.email}>{cooperative.email || "Email non renseigné"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-50">
                <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center shrink-0 border border-emerald-700/30">
                  <FaUser className="text-amber-400" />
                </div>
                <span className="truncate" title={cooperative.contact}>{cooperative.contact || "Responsable non défini"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-50">
                <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center shrink-0 border border-emerald-700/30">
                  <FaBox className="text-amber-400" />
                </div>
                <span>{products.length} produit(s)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-50">
                <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center shrink-0 border border-emerald-700/30">
                  <FaCalendarAlt className="text-amber-400" />
                </div>
                <span>Membre depuis {new Date(cooperative.created_at || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Left - Products */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Produits de la coopérative</h2>
                <span className="bg-amber-100 text-amber-900 text-sm font-bold px-4 py-1.5 rounded-full border border-amber-200 shadow-sm">{products.length} Articles</span>
              </div>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <FaBox className="text-slate-300 w-10 h-10" />
                  </div>
                  <p className="text-slate-500 font-medium">Aucun produit disponible pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map((product) => {
                    const productImage = getProductImage(product);
                    return (
                      <Link to={`/products/${product.id}`} key={product.id} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
                        <div className="h-44 bg-slate-50 relative p-4 flex items-center justify-center group-hover:bg-emerald-50/50 transition-colors">
                          {productImage ? (
                            <img src={productImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src = "https://via.placeholder.com/400x300/065f46/fef3c7?text=Produit"} />
                          ) : (
                            <FaBox className="text-slate-300 w-12 h-12" />
                          )}
                          {product.quantity > 0 ? (
                            <span className="absolute top-3 right-3 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-amber-500/20 z-10">
                              {product.price} DH
                            </span>
                          ) : (
                            <span className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-200 shadow-sm z-10">
                              Rupture
                            </span>
                          )}

                          {/* Mini Gallery inside Card (Always Visible for better UX) */}
                          {product.images && product.images.length > 0 && (
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 px-4 z-10">
                              <img
                                src={productImage}
                                alt="Main thumbnail"
                                className="w-8 h-8 object-contain bg-white rounded-md border border-white shadow-sm"
                              />
                              {product.images.slice(0, 3).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img.url}
                                  alt={`Gallery thumbnail ${idx}`}
                                  className="w-8 h-8 object-contain bg-white rounded-md border border-white shadow-sm"
                                />
                              ))}
                              {product.images.length > 3 && (
                                <div className="w-8 h-8 bg-black/50 text-white text-[10px] font-bold rounded-md flex items-center justify-center border border-white shadow-sm">
                                  +{product.images.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col relative bg-white z-20">
                          <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                          <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">{product.description || "Aucune description fournie"}</p>
                          <div className="mt-auto flex items-center justify-between text-xs font-medium border-t border-slate-100 pt-3">
                            <span className="text-slate-500 flex items-center gap-1"><FaBox className="text-emerald-500 w-3 h-3" /> Stock: {product.quantity}</span>
                            <span className="text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Détails <FaArrowLeft className="w-3 h-3 rotate-180" /></span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>


          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Localisation */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <FaMapMarkerAlt className="text-emerald-600" /> Localisation
              </h2>

              {cooperative.latitude && cooperative.longitude ? (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <MapContainer
                    center={[cooperative.latitude, cooperative.longitude]}
                    zoom={13}
                    style={{ height: "250px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[cooperative.latitude, cooperative.longitude]}>
                      <Popup>
                        {cooperative.nom}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                  <FaMapMarkerAlt className="text-slate-300 text-3xl mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-medium">
                    Localisation non renseignée
                  </p>
                </div>
              )}
            </div>

            {/* Réseaux Sociaux */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <FaUser className="text-emerald-600" /> Réseaux Sociaux
              </h2>
              <div className="space-y-3">
                {(cooperative.whatsapp || cooperative.tele) ? (
                  <button onClick={handleWhatsAppClick} className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm text-sm">
                    <FaWhatsapp size={18} /> Discuter sur WhatsApp
                  </button>
                ) : null}

                {cooperative.facebook ? (
                  <button onClick={() => handleSocialClick('facebook', cooperative.facebook)} className="w-full flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium py-2.5 rounded-xl transition-colors text-sm shadow-sm">
                    <FaFacebook size={18} className="text-[#1877F2]" /> Facebook
                  </button>
                ) : null}

                {cooperative.instagram ? (
                  <button onClick={() => handleSocialClick('instagram', cooperative.instagram)} className="w-full flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium py-2.5 rounded-xl transition-colors text-sm shadow-sm">
                    <FaInstagram size={18} className="text-[#E4405F]" /> Instagram
                  </button>
                ) : null}

                {!cooperative.facebook && !cooperative.instagram && !cooperative.whatsapp && !cooperative.tele && (
                  <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">Aucun réseau social lié.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CooperativeDetail;