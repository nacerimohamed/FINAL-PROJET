import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import { useTranslation } from "react-i18next";
import { FaLeaf, FaEye, FaStore, FaTag } from "react-icons/fa";

const ANIMATION_STYLES = `
  .fade-up,
  .fade-left {
    opacity: 0;
    transition: opacity 0.65s ease, transform 0.65s ease;
    will-change: opacity, transform;
  }

  .fade-up { transform: translateY(40px); }
  .fade-left { transform: translateX(40px); }

  .fade-up.show,
  .fade-left.show {
    opacity: 1;
    transform: translate(0);
  }
  .product-card-animate {
    opacity: 0;
    will-change: transform, opacity;
  }
`;

function useScrollReveal(containerRef, dependency) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll(
        ".fade-up, .fade-left"
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
        }
      );

      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => clearTimeout(timeout);
  }, [containerRef, dependency]);
}

const Home = () => {
  const { t } = useTranslation();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredCooperatives, setFeaturedCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);

  const productsGridRef = useRef(null);
  const cooperativesGridRef = useRef(null);
  const aboutRef = useRef(null);
  const testimonialsRef = useRef(null);
  const faqRef = useRef(null);

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  const fetchFeaturedData = async () => {
    try {
      setLoading(true);

      const [productsRes, cooperativesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/products/featured"),
        axios.get("http://localhost:8000/api/cooperatives/featured"),
      ]);

      // 🔹 FIXED: Modified slice to take exactly 3 products
      if (productsRes.data.success) {
        setFeaturedProducts(productsRes.data.data.slice(0, 3));
      }

      // 🔹 FIXED: Modified slice to take exactly 3 cooperatives
      if (cooperativesRes.data.data) {
        setFeaturedCooperatives(cooperativesRes.data.data.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching featured data:", error);
    } finally {
      setLoading(false);
    }
  };

  useScrollReveal(productsGridRef, featuredProducts);
  useScrollReveal(cooperativesGridRef, featuredCooperatives);
  useScrollReveal(aboutRef, null);
  useScrollReveal(testimonialsRef, null);
  useScrollReveal(faqRef, null);

  const getProductImage = (product) => {
    if (product.image && !product.image.startsWith("http")) {
      return `http://localhost:8000${
        product.image.startsWith("/") ? "" : "/"
      }${product.image}`;
    }
    return product.image || "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";
  };

  const getCooperativeImage = (cooperative) => {
    const possibleFields = [
      "image", "logo", "imageUrl", "image_url", "photo", "image_path",
      "logo_url", "photo_url", "picture", "picture_url", "avatar", "profile_image"
    ];

    let imageField = null;
    for (const field of possibleFields) {
      if (cooperative[field]) {
        imageField = cooperative[field];
        break;
      }
    }

    if (!imageField && cooperative.images?.length > 0) {
      imageField = cooperative.images[0];
    }

    if (imageField) {
      if (typeof imageField === "string" && !imageField.startsWith("http")) {
        const cleanPath = imageField.startsWith("/") ? imageField : `/${imageField}`;
        return `http://localhost:8000${cleanPath}`;
      }
      return imageField;
    }

    const coopName = cooperative.nom || cooperative.name || "Coopérative";
    return `https://via.placeholder.com/400x250/059669/ffffff?text=${encodeURIComponent(coopName)}`;
  };

  return (
    <>
      <style>{ANIMATION_STYLES}</style>

      <Navbar />
      <Hero />

      {/* PRODUCTS SECTION */}
      <section id="products" className="py-20 bg-green-50/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-emerald-50/60 to-transparent rounded-full opacity-70 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3">
              <FaLeaf className="text-[10px]" />
              {t("home.featuredProducts")}
            </span>
            <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
              {t("home.productsDescription")}
            </p>
            <div className="w-14 h-1 bg-emerald-500 mx-auto rounded-full mt-4" />
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-100 border-t-emerald-600 mx-auto mb-4" />
              <p className="text-emerald-800 font-semibold text-sm animate-pulse">
                {t("home.loadingProducts")}
              </p>
            </div>
          ) : (
            <div
              ref={productsGridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="fade-up product-card-animate group bg-white rounded-2xl border border-emerald-100/60 shadow-sm overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full"
                  style={{ animation: `fadeUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${index * 80}ms both` }}
                >
                  <div className="relative h-52 w-full overflow-hidden bg-emerald-50/50 flex items-center justify-center border-b border-emerald-50">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {product.price && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-md border border-white/10">
                        <FaTag className="text-[10px] text-emerald-200" />
                        <span>{product.price} DH</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 line-clamp-2 text-xs leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="inline-flex items-center justify-center gap-1 w-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-emerald-700 px-4 py-2 rounded-xl transition-all duration-200 font-bold text-xs"
                      >
                        <FaEye className="text-[11px]" />
                        {t("home.productDetails")}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COOPERATIVES SECTION */}
      <section id="cooperatives" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3">
              <FaStore className="text-[10px]" />
              {t("home.featuredCooperatives")}
            </span>
            <div className="w-14 h-1 bg-emerald-500 mx-auto rounded-full mt-4" />
          </div>

          <div
            ref={cooperativesGridRef}
            // 🔹 FIXED: Changed lg:grid-cols-4 to lg:grid-cols-3 to perfectly balance the 3 items
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredCooperatives.map((cooperative, index) => (
              <div
                key={cooperative.id}
                className={`${
                  index % 2 === 0 ? "fade-up" : "fade-left"
                } group bg-white rounded-2xl border border-emerald-100/60 shadow-sm overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-52 w-full overflow-hidden bg-emerald-50/50 flex items-center justify-center border-b border-emerald-50">
                  <img
                    src={getCooperativeImage(cooperative)}
                    alt={cooperative.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                  <h3 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors mb-3">
                    {cooperative.nom}
                  </h3>

                  <Link
                    to={`/cooperatives/${cooperative.id}`}
                    className="inline-flex items-center justify-center gap-1 w-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-emerald-700 px-4 py-2 rounded-xl transition-all duration-200 font-bold text-xs"
                  >
                    <FaEye className="text-[11px]" />
                    {t("home.cooperativeDetails")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <div id="about" ref={aboutRef}>
        <AboutUs />
      </div>

      {/* TESTIMONIALS */}
      <div id="testimonials" ref={testimonialsRef}>
        <Testimonials />
      </div>

      {/* FAQ */}
      <div id="faq" ref={faqRef}>
        <FAQ />
      </div>

      <Footer />
      <Chatbot />
    </>
  );
};

export default Home;