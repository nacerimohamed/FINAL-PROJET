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

      if (productsRes.data.success) {
        setFeaturedProducts(productsRes.data.data.slice(0, 6));
      }

      if (cooperativesRes.data.data) {
        setFeaturedCooperatives(cooperativesRes.data.data.slice(0, 4));
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

    return (
      product.image ||
      "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit"
    );
  };

  const getCooperativeImage = (cooperative) => {
    const possibleFields = [
      "image",
      "logo",
      "imageUrl",
      "image_url",
      "photo",
      "image_path",
      "logo_url",
      "photo_url",
      "picture",
      "picture_url",
      "avatar",
      "profile_image",
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
      if (
        typeof imageField === "string" &&
        !imageField.startsWith("http")
      ) {
        const cleanPath = imageField.startsWith("/")
          ? imageField
          : `/${imageField}`;

        return `http://localhost:8000${cleanPath}`;
      }

      return imageField;
    }

    const coopName = cooperative.nom || cooperative.name || "Coopérative";

    return `https://via.placeholder.com/400x250/059669/ffffff?text=${encodeURIComponent(
      coopName
    )}`;
  };

  return (
    <>
      <style>{ANIMATION_STYLES}</style>

      <Navbar />
      <Hero />

      {/* PRODUCTS */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              {t("home.featuredProducts")}
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t("home.productsDescription")}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 mx-auto"></div>

              <p className="mt-4 text-gray-600">
                {t("home.loadingProducts")}
              </p>
            </div>
          ) : (
            <div
              ref={productsGridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="fade-up bg-white rounded-xl shadow-lg overflow-hidden"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 mb-4">
                      {product.description}
                    </p>

                    <Link
                      to={`/products/${product.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg inline-block"
                    >
                      {t("home.productDetails")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COOPERATIVES */}
      <section id="cooperatives" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              {t("home.featuredCooperatives")}
            </h2>
          </div>

          <div
            ref={cooperativesGridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredCooperatives.map((cooperative, index) => (
              <div
                key={cooperative.id}
                className={`${
                  index % 2 === 0 ? "fade-up" : "fade-left"
                } bg-white rounded-xl shadow-lg overflow-hidden`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <img
                  src={getCooperativeImage(cooperative)}
                  alt={cooperative.nom}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold mb-3">
                    {cooperative.nom}
                  </h3>

                  <Link
                    to={`/cooperatives/${cooperative.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg inline-block"
                  >
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