import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaRegImage, 
  FaSearch, 
  FaRedo, 
  FaBuilding, 
  FaLeaf, 
  FaChevronRight, 
  FaTimes 
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import RegionMapPublic, { PROVINCES } from "../components/RegionMapPublic";

const Cooperatives = () => {
  const { t } = useTranslation();
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => { fetchCooperatives(); }, []);

  const fetchCooperatives = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/cooperatives");
      if (res.data.success) {
        const data = res.data.data.map((coop) => {
          let cityId = null;
          if (coop.ville) {
            const v = coop.ville.trim().toLowerCase();
            if (v === "tinghir") cityId = "Tinghir";
            else if (v === "ouarzazate") cityId = "Ouarzazate";
            else if (v === "midelt") cityId = "Midelt";
            else if (v === "errachidia") cityId = "Errachidia";
            else if (v === "zagora") cityId = "Zagora";
          }
          if (!cityId) {
            const loc = (coop.region || coop.province || coop.adresse || coop.city || "").toLowerCase();
            if (loc.includes("ouarzazate")) cityId = "Ouarzazate";
            else if (loc.includes("midelt")) cityId = "Midelt";
            else if (loc.includes("errachidia")) cityId = "Errachidia";
            else if (loc.includes("zagora")) cityId = "Zagora";
            else if (loc.includes("tinghir")) cityId = "Tinghir";
          }
          return { ...coop, cityId };
        });
        setCooperatives(data);
      }
    } catch (err) {
      setError(t("cooperatives.error"));
    } finally {
      setLoading(false);
    }
  };

  const getImage = (coop) => {
    if (!coop.image) return null;
    const name = coop.image.startsWith("uploads/") ? coop.image.replace("uploads/", "") : coop.image;
    return `http://localhost:8000/uploads/${name}`;
  };

  // Counts per province
  const counts = {};
  PROVINCES.forEach((p) => { counts[p.id] = cooperatives.filter((c) => c.cityId === p.id).length; });

  const filtered = cooperatives.filter((coop) => {
    const matchSearch = coop.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = !selectedCity || coop.cityId === selectedCity;
    return matchSearch && matchCity;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50/30">
          <div className="relative flex items-center justify-center">
            <div className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-emerald-500 opacity-20" />
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-100 border-t-emerald-600" />
          </div>
          <p className="text-emerald-800 font-semibold tracking-wide mt-4 animate-pulse text-sm">
            {t("cooperatives.loading")}
          </p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-green-50/30 px-4">
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-xl max-w-md w-full text-center transform scaleUp">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">⚠️</div>
            <p className="text-gray-800 font-bold text-lg mb-2">{t("cooperatives.errorTitle" || "Erreur")}</p>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{error}</p>
            <button 
              onClick={fetchCooperatives} 
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-md shadow-emerald-600/10 active:scale-95 transition-all font-semibold text-sm"
            >
              <FaRedo className="text-xs animate-spin-slow" /> {t("common.retry")}
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

      {/* Hero Header b lkhder lghami9 premium */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 overflow-hidden py-5 border-b-4 border-emerald-500">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 mb-4 animate-fade-in">
            <FaLeaf className="text-[10px] text-emerald-400" />
            Région Drâa-Tafilalet
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl mx-auto drop-shadow-sm">
            {t("cooperatives.title")}
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 max-w-xl mx-auto font-medium">
            {t("cooperatives.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-green-50/20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Map Section */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4 md:p-6 mb-8 transform transition-all hover:shadow-md">
            <RegionMapPublic selected={selectedCity} onSelect={setSelectedCity} counts={counts} />
          </div>

          {/* Action Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-emerald-100/60">
            {/* Search Input m3a icon */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600">
                <FaSearch className="text-sm" />
              </div>
              <input
                type="text"
                placeholder={t("cooperatives.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-emerald-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium shadow-sm transition-all outline-none bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 placeholder-gray-400 text-gray-700"
              />
            </div>

            {/* Filter Tags & Results Counter */}
            <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
              {selectedCity && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold scaleUp">
                  <FaMapMarkerAlt className="text-emerald-600" />
                  {PROVINCES.find((p) => p.id === selectedCity)?.labelFr}
                  <button 
                    onClick={() => setSelectedCity(null)} 
                    className="ml-1 bg-emerald-200/60 hover:bg-emerald-200 text-emerald-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[9px] font-bold transition-colors"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
                <FaBuilding className="text-emerald-600 text-xs" />
                {filtered.length} {filtered.length > 1 ? "coopératives" : "coopérative"}
              </div>
            </div>
          </div>

          {/* Grid Layout / Empty State */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100 shadow-sm max-w-lg mx-auto p-8 transform scaleUp">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                <FaSearch />
              </div>
              <h3 className="text-gray-800 font-bold text-lg mb-1">{t("cooperatives.noResults")}</h3>
              <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">Aucune coopérative ne correspond à vos critères de recherche.</p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedCity(null); }} 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-xs shadow-md shadow-emerald-600/10 active:scale-95"
              >
                <FaRedo className="text-[10px]" /> Réinitialiser
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((coop, i) => {
                const img = getImage(coop);
                return (
                  <div 
                    key={coop.id} 
                    className="group bg-white rounded-2xl border border-emerald-100/60 shadow-sm overflow-hidden hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col h-full"
                    style={{ animation: `fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 30}ms both` }}
                  >
                    {/* Media Block */}
                    <div className="relative h-44 w-full overflow-hidden bg-emerald-50/50 flex items-center justify-center border-b border-emerald-50">
                      {img ? (
                        <img 
                          src={img} 
                          alt={coop.nom} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                          onError={(e) => { e.target.style.display = "none"; }} 
                        />
                      ) : (
                        <div className="flex flex-col items-center text-emerald-300/80 group-hover:text-emerald-500 transition-colors">
                          <FaRegImage className="text-3xl mb-1.5" />
                          <p className="text-[10px] font-bold tracking-wider uppercase">{t("cooperatives.noImage")}</p>
                        </div>
                      )}
                      
                      {/* Floating Badge location */}
                      {coop.cityId && (
                        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm">
                          <FaMapMarkerAlt className="text-[9px]" />
                          {PROVINCES.find((p) => p.id === coop.cityId)?.labelFr || ""}
                        </div>
                      )}
                    </div>

                    {/* Content Block */}
                    <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {coop.nom}
                        </h3>
                        {coop.description ? (
                          <p className="text-gray-500 line-clamp-2 text-xs leading-relaxed">
                            {coop.description}
                          </p>
                        ) : (
                          <p className="text-gray-300 italic text-[11px]">Aucune description disponible</p>
                        )}
                      </div>

                      {/* Contact metadata */}
                      <div className="space-y-1 pt-2 border-t border-emerald-50/60">
                        {(coop.adresse || coop.region) && (
                          <div className="text-[11px] text-gray-500 flex items-start gap-1.5">
                            <FaMapMarkerAlt className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{coop.adresse || coop.region}</span>
                          </div>
                        )}
                        {coop.tele && (
                          <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                            <FaPhone className="text-emerald-500 flex-shrink-0 text-[9px]" />
                            <span className="font-semibold text-gray-600">{coop.tele}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA Button khder */}
                      <Link 
                        to={`/cooperatives/${coop.id}`} 
                        className="inline-flex items-center justify-center gap-1 w-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-emerald-700 px-4 py-2 rounded-xl transition-all duration-200 font-bold text-xs"
                      >
                        {t("cooperatives.viewProducts")}
                        <FaChevronRight className="text-[9px] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
      
      {/* Animations scope style */}
      <style>{`
        @keyframes fadeUp { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .scaleUp {
          animation: scaleUpKey 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes scaleUpKey {
          from { transform: scale(0.97); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Cooperatives;