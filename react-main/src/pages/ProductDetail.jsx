import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import { FaStore, FaTag, FaArrowRight, FaMinus, FaPlus, FaCheckCircle } from "react-icons/fa";
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

  const handleConfirmPurchase = () => {
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

  const handleQuantityChange = (value) => {
    if (value === "") {
      setQuantity("");
      return;
    }
    
    let numValue = Number(value);
    
    if (isNaN(numValue)) {
      setQuantity(1);
      return;
    }
    
    if (numValue < 1) {
      numValue = 1;
    }
    
    setQuantity(numValue);
  };

  const incrementQuantity = () => {
    let newValue = quantity === "" ? 1 : quantity + 1;
    if (newValue < 1) {
      newValue = 1;
    }
    setQuantity(newValue);
  };

  const decrementQuantity = () => {
    let newValue = quantity === "" ? 1 : quantity - 1;
    if (newValue < 1) {
      newValue = 1;
    }
    setQuantity(newValue);
  };

  const calculateTotal = () => {
    const qty = quantity === "" ? 0 : quantity;
    return (product.price * qty).toFixed(2);
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-emerald-500 mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Chargement...</p>
        </div>
      </div>
      <Footer />
    </>
  );

  if (error || !product) return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-gray-600 mb-4">{error || 'Produit introuvable.'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
          >
            Retour aux produits
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Breadcrumb - Minimal */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <BackButton className="!mb-0 !p-1.5 !bg-transparent !hover:bg-gray-100" />
            <Link to="/" className="hover:text-gray-700">Accueil</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gray-700">Produits</Link>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section - Compact Layout */}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Image Section */}
          <div className="sticky top-24 space-y-3">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-[4/3] relative">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-contain p-3"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/600x400/f3f4f6/9ca3af?text=Produit"; }}
                />
                {(product.category || product.categorie) && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                    {product.category || product.categorie}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveImage(product.image)}
                  className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                    activeImage === product.image ? 'border-emerald-500' : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={product.image} alt="Main" className="w-full h-full object-cover" />
                </button>
                {product.images.slice(0, 3).map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.url)}
                    className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === img.url ? 'border-emerald-500' : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            {/* Cooperative */}
            <Link 
              to={`/cooperatives/${product.cooperative?.id}`} 
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md w-fit"
            >
              <FaStore className="text-[10px]" />
              {product.cooperative?.name || product.cooperative?.nom}
            </Link>

            {/* Title, Price & Stock */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">{product.price}</span>
                  <span className="text-sm text-gray-500">DH</span>
                </div>
                {product.quantity > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                    <FaCheckCircle className="text-emerald-500 text-[10px]" />
                    En stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                    Stock limité
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="text-sm text-gray-600 leading-relaxed pt-2">
                {product.description}
              </div>
            )}

            {/* Order Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4 mt-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Quantité</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity === 1 || quantity === ""}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-30 transition border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="w-16 h-8 text-center text-sm font-medium text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  
                  <button
                    onClick={incrementQuantity}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700">Total</span>
                <span className="text-xl font-bold text-emerald-600">
                  {calculateTotal()} DH
                </span>
              </div>

              {/* Main CTA - Always "Commander maintenant" */}
              <button
                onClick={handlePurchaseClick}
                className="w-full py-4 rounded-lg font-semibold text-base transition-all flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-98"
              >
                Commander maintenant
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaStore className="text-emerald-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Finaliser la commande
              </h3>
              <p className="text-sm text-gray-600">
                {product.name} • {quantity} x {product.price} DH
              </p>
              <p className="text-base font-bold text-emerald-600 mt-2">
                Total: {calculateTotal()} DH
              </p>
            </div>

            <div className="space-y-2">
              <button 
                onClick={handleConfirmPurchase} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-md font-medium text-sm transition flex items-center justify-center gap-2"
              >
                Confirmer la commande
              </button>
              <button 
                onClick={() => setShowPurchaseModal(false)} 
                className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition"
              >
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