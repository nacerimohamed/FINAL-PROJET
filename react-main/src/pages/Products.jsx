import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FaSearch, 
  FaWhatsapp, 
  FaRegImage, 
  FaRedo, 
  FaBoxes, 
  FaEye, 
  FaStore, 
  FaTag,
  FaLeaf
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);
  const [currentMin, setCurrentMin] = useState(0);
  const [currentMax, setCurrentMax] = useState(1000);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/products");
      if (response.data.success) {
        const data = response.data.data;
        setProducts(data);
        if (data.length > 0) {
          const prices = data.map((p) => parseFloat(p.price) || 0);
          const minP = Math.floor(Math.min(...prices));
          const maxP = Math.ceil(Math.max(...prices));
          setPriceMin(minP); setPriceMax(maxP);
          setCurrentMin(minP); setCurrentMax(maxP);
        }
      }
    } catch (err) {
      setError(t('products.error'));
    } finally { setLoading(false); }
  };

  const categories = useMemo(() => {
    const cats = new Set();
    products.forEach((p) => { if (p.category) cats.add(p.category); else if (p.categorie) cats.add(p.categorie); });
    return Array.from(cats).sort();
  }, [products]);

  const getProductImage = (product) =>
    product.image || "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";

  const handleWhatsAppClick = (product) => {
    const phone = product.cooperative?.whatsapp || product.cooperative?.phone;
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      const message = encodeURIComponent(t('products.whatsappMessage', { productName: product.name }));
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
    } else alert(t('products.noWhatsApp'));
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const productCategory = product.category || product.categorie || "";
      const matchesCategory = selectedCategory === "all" || productCategory === selectedCategory;
      const price = parseFloat(product.price) || 0;
      const matchesPrice = price >= currentMin && price <= currentMax;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, currentMin, currentMax]);

  const resetFilters = () => { setSelectedCategory("all"); setCurrentMin(priceMin); setCurrentMax(priceMax); setSearchTerm(""); };
  const activeFilterCount = (selectedCategory !== "all" ? 1 : 0) + (currentMin !== priceMin || currentMax !== priceMax ? 1 : 0);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50/30">
          <div className="relative flex items-center justify-center">
            <div className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-emerald-500 opacity-20" />
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-100 border-t-emerald-600" />
          </div>
          <p className="text-emerald-800 font-semibold tracking-wide mt-4 animate-pulse text-sm">
            {t('products.loading')}
          </p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-green-50/30 px-4">
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-xl max-w-md w-full text-center transform scaleUp">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
            <p className="text-gray-800 font-bold text-lg mb-2">{t('products.errorTitle' || "Erreur")}</p>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{error}</p>
            <button
              onClick={fetchProducts}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-md shadow-emerald-600/10 active:scale-95 transition-all font-semibold text-sm"
            >
              <FaRedo className="text-xs" /> {t('common.retry')}
            </button>
          </div>
        </div>
      </>
    );

  /* ── Sidebar Content (reused for desktop & mobile drawer) ── */
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <FaSearch className="text-green-600 text-xs" />
          {t('products.searchPlaceholder')}
        </label>
        <input type="text" placeholder={t('products.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400 transition" />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <FaLeaf className="text-green-600 text-xs" />
          {t('products.category')}
        </label>
        <div className="space-y-1.5">
          <button onClick={() => setSelectedCategory("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === "all" ? "bg-green-600 text-white shadow-md" : "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700"}`}>
            {t('common.all')} <span className="float-right text-xs opacity-70">({products.length})</span>
          </button>
          {categories.map((cat) => {
            const count = products.filter(p => (p.category || p.categorie) === cat).length;
            return (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === cat ? "bg-green-600 text-white shadow-md" : "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700"}`}>
                {cat} <span className="float-right text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <FaTag className="text-green-600 text-xs" />
          {t('products.priceRange')}
        </label>
        <div className="flex items-center justify-between mb-3">
          <span className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-sm font-bold text-green-700">{currentMin} DH</span>
          <div className="flex-1 mx-2 border-t-2 border-dashed border-green-200"></div>
          <span className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-sm font-bold text-green-700">{currentMax} DH</span>
        </div>
        <div className="relative pt-1 pb-3">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div className="absolute h-2 rounded-full" style={{ background:'linear-gradient(90deg,#16a34a,#22c55e)', left:`${((currentMin-priceMin)/(priceMax-priceMin))*100}%`, right:`${100-((currentMax-priceMin)/(priceMax-priceMin))*100}%` }}></div>
          </div>
          <input type="range" min={priceMin} max={priceMax} value={currentMin} onChange={(e)=>{const v=Math.min(Number(e.target.value),currentMax-1);setCurrentMin(v);}} className="abs-slider z-20" />
          <input type="range" min={priceMin} max={priceMax} value={currentMax} onChange={(e)=>{const v=Math.max(Number(e.target.value),currentMin+1);setCurrentMax(v);}} className="abs-slider z-30" />
        </div>
        <div className="flex gap-2 mt-1">
          <input type="number" min={priceMin} max={currentMax-1} value={currentMin} onChange={(e)=>{const v=Math.min(Number(e.target.value),currentMax-1);if(v>=priceMin)setCurrentMin(v);}}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Min" />
          <input type="number" min={currentMin+1} max={priceMax} value={currentMax} onChange={(e)=>{const v=Math.max(Number(e.target.value),currentMin+1);if(v<=priceMax)setCurrentMax(v);}}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Max" />
        </div>
      </div>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button onClick={resetFilters} className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all duration-200 flex items-center justify-center gap-2">
          {t('products.reset') || 'Réinitialiser'}
        </button>
      )}

      {/* Results count */}
      <div className="pt-3 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500"><span className="font-bold text-green-700">{filteredProducts.length}</span> / {products.length} {t('common.products')?.toLowerCase()}</p>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 overflow-hidden py-10 border-b-4 border-emerald-500">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 mb-4 animate-fade-in">
            <FaLeaf className="text-[10px] text-emerald-400" />
            Produits Terroirs
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl mx-auto drop-shadow-sm">
            {t('products.title')}
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 max-w-xl mx-auto font-medium">
            {t('products.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-semibold transition-all duration-300 shadow-sm">
            <span>{t('common.filter')}</span>
            {activeFilterCount > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">{activeFilterCount}</span>}
          </button>
        </div>

        <div className="flex gap-6">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-green-100 p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                {t('common.filter')}
              </h3>
              <SidebarContent />
            </div>
          </aside>

          {/* ── Mobile Sidebar Drawer ── */}
          {sidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
          <div className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 lg:hidden overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  {t('common.filter')}
                </h3>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
              </div>
              <SidebarContent />
            </div>
          </div>

          {/* ── Products Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Active filters tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm text-gray-500 font-medium">{t('common.filter')}:</span>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-red-500 transition-colors">✕</button>
                  </span>
                )}
                {(currentMin !== priceMin || currentMax !== priceMax) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                    {currentMin} - {currentMax} DH
                    <button onClick={() => { setCurrentMin(priceMin); setCurrentMax(priceMax); }} className="ml-1 hover:text-red-500 transition-colors">✕</button>
                  </span>
                )}
                <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-700 font-medium ml-2 underline">{t('products.resetAll') || 'Tout effacer'}</button>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100 shadow-sm mx-auto p-8 transform scaleUp">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                  <FaSearch />
                </div>
                <p className="text-gray-600 text-lg font-bold">{t('products.noResults')}</p>
                {activeFilterCount > 0 && <button onClick={resetFilters} className="text-green-700 underline hover:text-green-900 font-medium mt-2">{t('products.resetFilters')}</button>}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="product-card-animate group bg-white rounded-2xl border border-emerald-100/60 shadow-sm overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full"
                    style={{ animation: `fadeUp 0.5s cubic-bezier(0.25, 1, 0.5, 1) ${i * 80}ms both` }}
                  >
                    {/* Image Wrapper */}
                    <div className="relative h-52 w-full overflow-hidden bg-emerald-50/50 flex items-center justify-center border-b border-emerald-50">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200/10b981/ffffff?text=Produit";
                        }}
                      />

                      {/* Floating Price Tag */}
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-md border border-white/10">
                        <FaTag className="text-[10px] text-emerald-200" />
                        <span>{product.price} DH</span>
                      </div>
                      
                      {(product.category || product.categorie) && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-100">{product.category || product.categorie}</div>
                      )}
                    </div>

                    {/* Content Block */}
                    <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {product.name}
                        </h3>

                        {product.description ? (
                          <p className="text-gray-500 line-clamp-2 text-xs leading-relaxed">
                            {product.description}
                          </p>
                        ) : (
                          <p className="text-gray-300 italic text-[11px]">Aucune description disponible</p>
                        )}
                      </div>

                      {/* Cooperative Tag Block */}
                      <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50 flex items-start gap-2.5">
                        <FaStore className="text-emerald-600 text-xs mt-0.5 flex-shrink-0" />
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{t('products.cooperative')}</p>
                          <p className="text-xs font-bold text-emerald-800 line-clamp-1">
                            {product.cooperative?.name || t('products.unspecified')}
                          </p>
                        </div>
                      </div>

                      {/* Actions Block */}
                      <div className="mt-auto space-y-3 pt-2">
                        <div className="flex justify-between items-center text-xs border-b border-emerald-50/60 pb-2">
                          <span className="text-sm text-green-600">{t('products.stock')}: <span className="font-semibold text-green-700 ml-1">{product.quantity}</span></span>
                          <Link
                            to={`/products/${product.id}`}
                            className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors border border-emerald-200/40"
                          >
                            <FaEye className="text-[11px]" />
                            {t('products.viewDetails')}
                          </Link>
                        </div>

                        {(product.cooperative?.whatsapp || product.cooperative?.phone) && (
                          <button
                            onClick={() => handleWhatsAppClick(product)}
                            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98]"
                          >
                            <FaWhatsapp className="text-base animate-bounce-slow" />
                            {t('products.buyOnWhatsApp')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Embedded Animations Style */}
      <style>{`
        .abs-slider {
          position: absolute; top: 4px; width: 100%; height: 8px;
          -webkit-appearance: none; appearance: none;
          background: transparent; pointer-events: none;
        }
        .abs-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          height: 20px; width: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          cursor: pointer; pointer-events: all;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(22,163,74,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .abs-slider::-webkit-slider-thumb:hover { transform: scale(1.2); box-shadow: 0 4px 12px rgba(22,163,74,0.5); }
        .abs-slider::-moz-range-thumb {
          height: 20px; width: 20px; border-radius: 50%;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          cursor: pointer; pointer-events: all;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(22,163,74,0.4);
        }

        .product-card-animate {
          opacity: 0;
          will-change: transform, opacity;
        }

        @keyframes fadeUp { 
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          } 
          to { 
            opacity: 1; 
            transform: translateY(0); 
          } 
        }
        .scaleUp {
          animation: scaleUpKey 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes scaleUpKey {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Products;