import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredCooperatives, setFeaturedCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  const fetchFeaturedData = async () => {
    try {
      setLoading(true);
      const [productsRes, cooperativesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/products/featured"),
        axios.get("http://localhost:8000/api/cooperatives/featured")
      ]);

      if (productsRes.data.success) {
        setFeaturedProducts(productsRes.data.data);
      }
      if (cooperativesRes.data.data) {
        setFeaturedCooperatives(cooperativesRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching featured data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    if (product.image && !product.image.startsWith('http')) {
      return `http://localhost:8000${product.image.startsWith('/') ? '' : '/'}${product.image}`;
    }
    return product.image || "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";
  };

  const getCooperativeImage = (cooperative) => {
    const possibleFields = [
      'image',
      'logo',
      'imageUrl',
      'image_url',
      'photo',
      'image_path',
      'logo_url',
      'photo_url',
      'picture',
      'picture_url',
      'avatar',
      'profile_image'
    ];

    let imageField = null;
    
    for (const field of possibleFields) {
      if (cooperative[field]) {
        imageField = cooperative[field];
        break;
      }
    }

    if (!imageField && cooperative.images && cooperative.images.length > 0) {
      imageField = cooperative.images[0];
    }

    if (imageField) {
      if (typeof imageField === 'string' && !imageField.startsWith('http')) {
        const cleanPath = imageField.startsWith('/') ? imageField : `/${imageField}`;
        return `http://localhost:8000${cleanPath}`;
      }
      return imageField;
    }
    
    const coopName = cooperative.nom || cooperative.name || "Coopérative";
    return `https://via.placeholder.com/400x250/059669/ffffff?text=${encodeURIComponent(coopName)}`;
  };

  return (
    <>
      <Navbar />
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              {t('home.featuredProducts')}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('home.productsDescription')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('home.loadingProducts')}</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
              {featuredProducts.map((product, index) => {
                let cooperativeId = null;
                
                if (product.cooperative) {
                  cooperativeId = product.cooperative.id || product.cooperative._id;
                }
                
                if (!cooperativeId) {
                  cooperativeId = product.cooperativeId || product.cooperative_id;
                }

                return (
                  <div
                    key={product.id || product._id || index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {t('home.price', { price: product.price })}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                          {product.description}
                        </p>
                      )}
                      
                      <p className="text-sm text-green-700 font-semibold mb-4">
                        {product.cooperative?.name || 
                         product.cooperative?.nom || 
                         t('home.cooperativeDetails')}
                      </p>

                      <div className="space-y-3">
                        <Link
                          to={`/products/${product.id || product._id}`}
                          className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                          {t('home.productDetails')}
                        </Link>
                        
                        {cooperativeId && (
                          <Link
                            to={`/cooperatives/${cooperativeId}`}
                            className="block w-full text-center border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-semibold text-sm"
                          >
                            {t('home.viewAllCooperativeProducts')}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">{t('home.noProducts')}</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              {t('home.viewAllProducts')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cooperatives Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              {t('home.featuredCooperatives')}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('home.cooperativesDescription')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('home.loadingCooperatives')}</p>
            </div>
          ) : featuredCooperatives.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
              {featuredCooperatives.map((cooperative, index) => {
                const imageUrl = getCooperativeImage(cooperative);
                const cooperativeId = cooperative.id || cooperative._id;
                
                return (
                  <div
                    key={cooperativeId || index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={cooperative.nom || cooperative.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          const coopName = cooperative.nom || cooperative.name || t('cooperatives.title');
                          e.target.src = `https://via.placeholder.com/400x250/059669/ffffff?text=${encodeURIComponent(coopName)}`;
                        }}
                      />
                      {cooperative.region && (
                        <div className="absolute bottom-2 left-2 bg-green-800/80 text-white px-2 py-1 rounded text-xs">
                          {cooperative.region}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {cooperative.nom || cooperative.name}
                      </h3>
                      
                      {cooperative.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                          {cooperative.description}
                        </p>
                      )}

                      <div className="flex flex-col space-y-3">
                        <Link
                          to={`/cooperatives/${cooperativeId}`}
                          className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                        >
                          {t('home.cooperativeDetails')}
                        </Link>
                        
                        <Link
                          to={`/products?cooperative=${cooperativeId}`}
                          className="block w-full text-center border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-semibold text-sm"
                        >
                          {t('home.viewProducts')}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">{t('home.noCooperatives')}</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/cooperatives"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              {t('home.viewAllCooperatives')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;