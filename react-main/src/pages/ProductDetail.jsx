import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import { FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";
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

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (err) {
      setError(t('productDetail.error'));
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) =>
    product?.image || "https://via.placeholder.com/600x400/10b981/ffffff?text=Produit";

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
    } else alert(t('productDetail.noWhatsApp'));
  };

  const handleEmailPurchase = () => {
    const email = product.cooperative?.email;
    if (email) {
      const subject = encodeURIComponent(t('productDetail.emailSubject', { productName: product.name }));
      const body = encodeURIComponent(
        t('productDetail.emailBody', {
          productName: product.name,
          price: product.price,
          quantity: quantity,
          total: (product.price * quantity).toFixed(2)
        })
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setShowPurchaseModal(false);
    } else alert(t('productDetail.noEmail'));
  };

  const handlePhoneCall = () => {
    const phone = product.cooperative?.tele;
    if (phone) window.location.href = `tel:${phone}`;
    else alert(t('productDetail.noPhone'));
  };

  const incrementQuantity = () => quantity < product.quantity && setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4 shadow-md"></div>
          <p className="text-green-700 text-lg">{t('productDetail.loading')}</p>
        </div>
      </div>
      <Footer />
    </>
  );

  if (error || !product) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || t('productDetail.notFound')}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {t('productDetail.backToProducts')}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-green-50 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <BackButton className="mb-3" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600">{t('common.home')}</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-green-600">{t('common.products')}</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-green-100 shadow-xl hover:shadow-2xl transition">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="w-full h-full object-cover transform transition duration-500 hover:scale-105"
                onError={(e)=>{ e.target.src = "https://via.placeholder.com/600x400/10b981/ffffff?text=Produit"; }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-green-800">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-green-700">{t('productDetail.price', { price: product.price })}</span>
              {product.quantity > 0 
                ? <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {t('productDetail.inStock', { quantity: product.quantity })}
                  </span>
                : <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {t('productDetail.outOfStock')}
                  </span>
              }
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-b border-green-200 py-4">
                <h2 className="text-xl font-semibold text-green-800 mb-2">{t('productDetail.description')}</h2>
                <p className="text-green-700">{product.description}</p>
              </div>
            )}

            {/* Cooperative */}
            <div className="bg-green-50 rounded-xl p-4 shadow-inner">
              <h2 className="text-lg font-semibold text-green-800 mb-2">{t('productDetail.cooperative')}</h2>
              <Link to={`/cooperatives/${product.cooperative?.id}`} className="text-green-600 font-semibold hover:underline">
                {product.cooperative?.nom || t('productDetail.unspecified')}
              </Link>
              <div className="mt-2 text-sm text-green-700 space-y-1">
                {product.cooperative?.email && <div>{t('productDetail.email')}: {product.cooperative.email}</div>}
                {product.cooperative?.tele && <div>{t('productDetail.phone')}: {product.cooperative.tele}</div>}
              </div>
            </div>

            {/* Quantity */}
            {product.quantity > 0 && (
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="bg-green-100 hover:bg-green-200 text-green-700 w-10 h-10 rounded-lg font-bold transition transform hover:scale-110 shadow-sm"
                  disabled={quantity <= 1}
                >-</button>
                <span className="text-2xl font-bold text-green-800 w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="bg-green-100 hover:bg-green-200 text-green-700 w-10 h-10 rounded-lg font-bold transition transform hover:scale-110 shadow-sm"
                  disabled={quantity >= product.quantity}
                >+</button>
              </div>
            )}

            {/* Total Price */}
            <div className="bg-green-50 rounded-xl p-4 shadow-inner">
              <div className="flex justify-between items-center text-green-800 font-bold text-xl">
                <span>{t('productDetail.total')}:</span>
                <span>{t('productDetail.price', { price: (product.price * quantity).toFixed(2) })}</span>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchaseClick}
              disabled={product.quantity === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                product.quantity > 0 
                  ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {product.quantity > 0 ? t('productDetail.orderNow') : t('productDetail.unavailable')}
            </button>

            {/* Contact Buttons with Icons */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {product.cooperative?.whatsapp && (
                <button
                  onClick={handleWhatsAppPurchase}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition transform hover:scale-105 shadow-md"
                >
                  <FaWhatsapp className="text-lg" /> {t('productDetail.whatsapp')}
                </button>
              )}
              {product.cooperative?.email && (
                <button
                  onClick={handleEmailPurchase}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition transform hover:scale-105 shadow-md"
                >
                  <FaEnvelope className="text-lg" /> {t('productDetail.email')}
                </button>
              )}
              {product.cooperative?.tele && (
                <button
                  onClick={handlePhoneCall}
                  className="flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-xl transition transform hover:scale-105 shadow-md"
                >
                  <FaPhone className="text-lg" /> {t('productDetail.call')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-green-50 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">{t('productDetail.chooseContactMethod')}</h2>
            <div className="space-y-3">
              {product.cooperative?.whatsapp && (
                <button onClick={handleWhatsAppPurchase} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                  <FaWhatsapp /> {t('productDetail.whatsapp')}
                </button>
              )}
              {product.cooperative?.email && (
                <button onClick={handleEmailPurchase} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                  <FaEnvelope /> {t('productDetail.email')}
                </button>
              )}
              {product.cooperative?.tele && (
                <button onClick={handlePhoneCall} className="w-full bg-green-400 hover:bg-green-500 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                  <FaPhone /> {t('productDetail.call')}
                </button>
              )}
              <button onClick={() => setShowPurchaseModal(false)} className="w-full mt-2 text-green-700 hover:text-green-900 font-semibold py-2 transition">
                {t('productDetail.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ProductDetail;