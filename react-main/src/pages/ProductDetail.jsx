import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import { FaWhatsapp, FaPhone, FaStore, FaEnvelope, FaTag } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
        setActiveImage(response.data.data.image || null);
      }
    } catch (err) {
      setError(t('productDetail.error', 'Erreur lors du chargement du produit.'));
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) =>
    activeImage || product?.image || "https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=Produit";

  const handlePurchaseClick = () => setShowPurchaseModal(true);

  const handleWhatsAppPurchase = () => {
    const phone = product.cooperative?.whatsapp || product.cooperative?.tele;
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      const message = encodeURIComponent(
        t('productDetail.whatsappMessage', {
          productName: product.name,
          price: product.price,
          quantity: quantity,
          total: (product.price * quantity).toFixed(2)
        })
      );
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
      setShowPurchaseModal(false);
    } else alert(t('productDetail.noWhatsApp', 'Numéro WhatsApp non disponible.'));
  };

  const handlePhoneCall = () => {
    const phone = product.cooperative?.tele;
    if (phone) window.location.href = `tel:${phone}`;
    else alert(t('productDetail.noPhone', 'Numéro de téléphone non disponible.'));
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-emerald-600 mx-auto mb-3"></div>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">{t('productDetail.loading', 'Chargement...')}</p>
        </div>
      </div>
      <Footer />
    </>
  );

  if (error || !product) return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
          <p className="text-gray-800 font-bold mb-6">{error || t('productDetail.notFound', 'Produit introuvable.')}</p>
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md active:scale-[0.98]"
          >
            {t('productDetail.backToProducts', 'Retour aux produits')}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <div className="bg-gray-50/50 min-h-screen flex flex-col">
      <Navbar />

      {/* Breadcrumb - Compact */}
      <div className="bg-white border-b border-gray-100 pt-3 pb-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-3 text-xs text-gray-500 font-bold">
          <BackButton className="!mb-0 !p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg" />
          <div className="flex items-center gap-2 truncate">
            <Link to="/" className="hover:text-emerald-600 transition-colors">{t('common.home', 'Accueil')}</Link>
            <span className="text-gray-300">/</span>
            <Link to="/products" className="hover:text-emerald-600 transition-colors">{t('common.products', 'Produits')}</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail Layout */}
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left: Image (Col span 5) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm group relative h-[320px] sm:h-[400px] lg:h-[450px]">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-full object-contain p-2 bg-white transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.target.src = "https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=Produit"; }}
              />
              {(product.category || product.categorie) && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-100 shadow-sm flex items-center gap-1.5">
                  <FaTag className="text-emerald-600" />
                  {product.category || product.categorie}
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                <button
                  onClick={() => setActiveImage(product.image)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === product.image ? 'border-emerald-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                >
                  <img src={product.image} alt="Main" className="w-full h-full object-contain p-1 bg-white" />
                </button>
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img.url ? 'border-emerald-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={img.url} alt={`Gallery ${img.id}`} className="w-full h-full object-contain p-1 bg-white" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col">

            {/* Header: Cooperative & Title */}
            <div className="mb-4">
              <Link to={`/cooperatives/${product.cooperative?.id}`} className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-600 uppercase tracking-wider hover:text-emerald-700 transition-colors mb-2 bg-emerald-50 px-2.5 py-1 rounded-md">
                <FaStore />
                {product.cooperative?.name || product.cooperative?.nom || t('productDetail.unspecified', 'Non spécifiée')}
              </Link>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Stock */}
            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {product.price} <span className="text-xl text-gray-400 font-bold ml-1">DH</span>
              </span>
              {product.quantity > 0 ? (
                <span className="mb-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  En stock ({product.quantity})
                </span>
              ) : (
                <span className="mb-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                  {t('productDetail.unavailable', 'Rupture de stock')}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">{t('productDetail.description', 'Description du produit')}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  {product.description}
                </p>
              </div>
            )}

            {/* Ordering Section */}
            <div className="mt-auto border border-gray-200 rounded-2xl p-5 sm:p-6 bg-white shadow-sm space-y-6 relative overflow-hidden">
              {/* Subtle decorative background */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
                {/* Quantity input */}
                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantité</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10 w-24 bg-gray-50 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-all">
                    <input
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      disabled={product.quantity === 0}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val === "") { setQuantity(""); return; }
                        val = Number(val);
                        if (val < 1) val = 1;
                        if (val > product.quantity) val = product.quantity;
                        setQuantity(val);
                      }}
                      className="w-full h-full text-center text-sm font-bold text-gray-900 bg-transparent outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="text-right">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Total à payer</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {quantity ? (product.price * quantity).toFixed(2) : "0.00"} <span className="text-sm text-gray-500 ml-0.5">DH</span>
                  </span>
                </div>
              </div>

              {/* Purchase Action */}
              <button
                onClick={handlePurchaseClick}
                disabled={product.quantity === 0 || !quantity}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] relative z-10 ${product.quantity > 0
                  ? 'bg-gray-900 hover:bg-black text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
              >
                {product.quantity > 0 ? t('productDetail.orderNow', 'Commander ce produit') : t('productDetail.unavailable', 'Indisponible')}
              </button>

              {/* Direct Contacts */}
              <div className="pt-5 border-t border-gray-100 relative z-10">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center mb-3">
                  Ou contacter la coopérative directement
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleWhatsAppPurchase}
                    disabled={!product.cooperative?.whatsapp && !product.cooperative?.tele}
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <FaWhatsapp className="text-sm" /> WhatsApp
                  </button>

                  <button
                    onClick={handlePhoneCall}
                    disabled={!product.cooperative?.tele}
                    className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 shadow-sm"
                  >
                    <FaPhone className="text-xs text-gray-400" /> Appeler
                  </button>
                </div>
                {product.cooperative?.email && (
                  <div className="mt-4 text-center">
                    <a href={`mailto:${product.cooperative.email}`} className="text-[11px] font-bold text-gray-500 hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5">
                      <FaEnvelope className="text-gray-400" /> {product.cooperative.email}
                    </a>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Modal Achat */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 transform transition-all">
            <h2 className="text-xl font-black text-gray-900 mb-1">
              Finaliser la commande
            </h2>
            <p className="text-xs font-medium text-gray-500 mb-6">
              Choisissez comment vous souhaitez contacter la coopérative pour finaliser l'achat de <strong>{product.name}</strong>.
            </p>

            <div className="space-y-3">
              <button onClick={handleWhatsAppPurchase} disabled={!product.cooperative?.whatsapp && !product.cooperative?.tele} className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white py-3 px-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm">
                <FaWhatsapp className="text-lg" /> Commander via WhatsApp
              </button>

              <button onClick={handlePhoneCall} disabled={!product.cooperative?.tele} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 py-3 px-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-gray-200 disabled:opacity-50 shadow-sm">
                <FaPhone className="text-gray-400" /> Appeler pour commander
              </button>

              <button onClick={() => setShowPurchaseModal(false)} className="w-full mt-2 text-gray-400 hover:text-gray-700 font-bold text-sm py-2 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;