import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import { useTranslation } from "react-i18next";

const CooperativeDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [cooperative, setCooperative] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (coop?.image) {
      if (coop.image.startsWith('uploads/')) {
        return `http://localhost:8000/${coop.image}`;
      }
      return coop.image;
    }
    return "https://via.placeholder.com/800x400/10b981/ffffff?text=Coopérative";
  };

  const getProductImage = (product) => {
    if (product?.image) {
      return product.image;
    }
    return "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t('cooperativeDetail.loading')}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !cooperative) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">{error || t('cooperativeDetail.notFound')}</p>
            <button
              onClick={() => navigate('/cooperatives')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              {t('cooperativeDetail.backToCooperatives')}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <BackButton className="mb-3" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600">{t('common.home')}</Link>
            <span>/</span>
            <Link to="/cooperatives" className="hover:text-green-600">{t('common.cooperatives')}</Link>
            <span>/</span>
            <span className="text-gray-900">{cooperative.nom}</span>
          </div>
        </div>
      </div>

      {/* Cooperative Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Cooperative Image */}
            <div className="order-2 md:order-1">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={getCooperativeImage(cooperative)}
                  alt={cooperative.nom}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x400/10b981/ffffff?text=Coopérative";
                  }}
                />
              </div>
            </div>

            {/* Cooperative Info */}
            <div className="order-1 md:order-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {cooperative.nom}
              </h1>
              {cooperative.description && (
                <p className="text-xl text-green-100 mb-6 leading-relaxed">
                  {cooperative.description}
                </p>
              )}
              
              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3">
                {cooperative.whatsapp && (
                  <button
                    onClick={handleWhatsAppClick}
                    className="flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t('cooperativeDetail.whatsapp')}
                  </button>
                )}
                {cooperative.email && (
                  <button
                    onClick={handleEmailClick}
                    className="flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {t('cooperativeDetail.email')}
                  </button>
                )}
                {cooperative.tele && (
                  <button
                    onClick={handlePhoneClick}
                    className="flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {t('cooperativeDetail.call')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          
          {/* Contact Information */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('cooperativeDetail.contactInfo')}
            </h2>
            
            <div className="space-y-4">
              {cooperative.adresse && (
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-700">{t('cooperativeDetail.address')}</p>
                    <p className="text-gray-600">{cooperative.adresse}</p>
                  </div>
                </div>
              )}

              {cooperative.email && (
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-700">{t('cooperativeDetail.email')}</p>
                    <a href={`mailto:${cooperative.email}`} className="text-green-600 hover:underline">
                      {cooperative.email}
                    </a>
                  </div>
                </div>
              )}

              {cooperative.tele && (
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-700">{t('cooperativeDetail.phone')}</p>
                    <a href={`tel:${cooperative.tele}`} className="text-green-600 hover:underline">
                      {cooperative.tele}
                    </a>
                  </div>
                </div>
              )}

              {cooperative.contact && (
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-700">{t('cooperativeDetail.contactPerson')}</p>
                    <p className="text-gray-600">{cooperative.contact}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cooperativeDetail.socialMedia')}</h2>
            
            <div className="space-y-3">
              {cooperative.facebook && (
                <button
                  onClick={() => handleSocialClick('facebook', cooperative.facebook)}
                  className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {t('cooperativeDetail.facebook')}
                </button>
              )}

              {cooperative.instagram && (
                <button
                  onClick={() => handleSocialClick('instagram', cooperative.instagram)}
                  className="w-full flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  {t('cooperativeDetail.instagram')}
                </button>
              )}

              {cooperative.whatsapp && (
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t('cooperativeDetail.whatsapp')}
                </button>
              )}

              {!cooperative.facebook && !cooperative.instagram && !cooperative.whatsapp && (
                <p className="text-gray-500 text-center py-4">{t('cooperativeDetail.noSocialMedia')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {t('cooperativeDetail.productsOf', { cooperativeName: cooperative.nom })}
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600 text-xl">{t('cooperativeDetail.noProducts')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col group"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {t('productDetail.price', { price: product.price })}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        {t('productDetail.stock')}: <span className="font-semibold text-gray-700">{product.quantity}</span>
                      </div>
                      <span className="text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                        {t('productDetail.viewDetails')} →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CooperativeDetail;