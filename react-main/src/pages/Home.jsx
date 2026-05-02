import React, { useState, useEffect, useRef } from "react"; // ← added useRef
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

// ─────────────────────────────────────────────────────────────
// ANIMATION STYLES  (injected once into <head>)
// We define CSS keyframes + utility classes here so no external
// library is needed.  Classes applied to cards:
//   • fade-up      → starts invisible + shifted 40px down
//   • fade-left    → starts invisible + shifted 40px to the right
//   • .show        → triggers the transition (added by IntersectionObserver)
// ─────────────────────────────────────────────────────────────
const ANIMATION_STYLES = `
  /* Base: all animatable cards start hidden */
  .fade-up,
  .fade-left {
    opacity: 0;
    transition: opacity 0.65s ease, transform 0.65s ease;
    will-change: opacity, transform;   /* GPU hint for smoothness */
  }

  /* Initial positions before animation fires */
  .fade-up   { transform: translateY(40px); }
  .fade-left { transform: translateX(40px); }   /* slides in from right */

  /* .show is added by IntersectionObserver → card becomes visible */
  .fade-up.show,
  .fade-left.show {
    opacity: 1;
    transform: translate(0);
  }
`;

// ─────────────────────────────────────────────────────────────
// Custom hook: observes all elements matching a CSS selector
// inside a container ref and adds .show when they enter the
// viewport.  Unobserves immediately → animation runs ONCE only.
// ─────────────────────────────────────────────────────────────
function useScrollReveal(containerRef, dependency) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;

      const elements = containerRef.current.querySelectorAll(".fade-up, .fade-left");

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
      });

      elements.forEach((el) => observer.observe(el));
    }, 100); // 👈 delay صغير باش DOM يكون واجد

    return () => clearTimeout(timeout);
  }, [containerRef, dependency]);
}

const Home = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredCooperatives, setFeaturedCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Refs for the two card grids ──────────────────────────────
  const productsGridRef = useRef(null);
  const cooperativesGridRef = useRef(null);

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
      setFeaturedProducts(productsRes.data.data.slice(0, 6)); // 👈 LIMIT 6
    }

    if (cooperativesRes.data.data) {
      setFeaturedCooperatives(cooperativesRes.data.data.slice(0, 4)); // 👈 LIMIT 4
    }

  } catch (error) {
    console.error("Error fetching featured data:", error);
  } finally {
    setLoading(false);
  }
};

  // ── Attach scroll-reveal observers after data has loaded ─────
  // We pass the grid refs so the hook only queries inside those
  // sections — keeps it scoped and efficient.
  useScrollReveal(productsGridRef, featuredProducts);
useScrollReveal(cooperativesGridRef, featuredCooperatives);

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

    if (!imageField && cooperative.images && cooperative.images.length > 0) {
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
      {/* ── Inject animation CSS once ── */}
      <style>{ANIMATION_STYLES}</style>

      <Navbar />
      <Hero />

      {/* ═══════════════════════════════════════════════════════
          Featured Products Section  (no logic changes)
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
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
              <p className="mt-4 text-gray-600">{t("home.loadingProducts")}</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            // ── ref added to the grid wrapper so the observer is scoped here
            <div
              ref={productsGridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8"
            >
              {featuredProducts.map((product, index) => {
                let cooperativeId = null;

                if (product.cooperative) {
                  cooperativeId =
                    product.cooperative.id || product.cooperative._id;
                }

                if (!cooperativeId) {
                  cooperativeId =
                    product.cooperativeId || product.cooperative_id;
                }

                // ── Animation class + stagger delay ─────────────────────
                // All product cards use fade-up.
                // animationDelay staggers each card by 100ms so they appear
                // sequentially rather than all at once.
                const staggerDelay = `${index * 100}ms`;

                return (
                  <div
                    key={product.id || product._id || index}
                    className="fade-up bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    // inline style for the stagger — doesn't conflict with Tailwind
                    style={{ transitionDelay: staggerDelay }}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {t("home.price", { price: product.price })}
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
                          t("home.cooperativeDetails")}
                      </p>

                      <div className="space-y-3">
                        <Link
                          to={`/products/${product.id || product._id}`}
                          className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                          {t("home.productDetails")}
                        </Link>

                        {cooperativeId && (
                          <Link
                            to={`/cooperatives/${cooperativeId}`}
                            className="block w-full text-center border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-semibold text-sm"
                          >
                            {t("home.viewAllCooperativeProducts")}
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
              <p className="text-gray-600">{t("home.noProducts")}</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              {t("home.viewAllProducts")}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          Featured Cooperatives Section  (no logic changes)
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              {t("home.featuredCooperatives")}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t("home.cooperativesDescription")}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {t("home.loadingCooperatives")}
              </p>
            </div>
          ) : featuredCooperatives.length > 0 ? (
            // ── ref added to the cooperatives grid wrapper
            <div
              ref={cooperativesGridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8"
            >
              {featuredCooperatives.map((cooperative, index) => {
                const imageUrl = getCooperativeImage(cooperative);
                const cooperativeId = cooperative.id || cooperative._id;

                // ── Alternating fade-up / fade-left for variety ──────────
                // Even-indexed cards slide up; odd-indexed cards slide from
                // the right.  Stagger delay is applied to both.
                const animClass = index % 2 === 0 ? "fade-up" : "fade-left";
                const staggerDelay = `${index * 100}ms`;

                return (
                  <div
                    key={cooperativeId || index}
                    className={`${animClass} bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
                    style={{ transitionDelay: staggerDelay }}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={cooperative.nom || cooperative.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          const coopName =
                            cooperative.nom ||
                            cooperative.name ||
                            t("cooperatives.title");
                          e.target.src = `https://via.placeholder.com/400x250/059669/ffffff?text=${encodeURIComponent(
                            coopName
                          )}`;
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
                          {t("home.cooperativeDetails")}
                        </Link>

                        <Link
                          to={`/products?cooperative=${cooperativeId}`}
                          className="block w-full text-center border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition font-semibold text-sm"
                        >
                          {t("home.viewProducts")}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">{t("home.noCooperatives")}</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/cooperatives"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              {t("home.viewAllCooperatives")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;