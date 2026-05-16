import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaPhone, FaRegImage } from "react-icons/fa";
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
          const loc = (coop.region || coop.province || coop.adresse || coop.city || "").toLowerCase();
          let cityId = null;
          if (loc.includes("tinghir")) cityId = "Tinghir";
          else if (loc.includes("ouarzazate")) cityId = "Ouarzazate";
          else if (loc.includes("midelt")) cityId = "Midelt";
          else if (loc.includes("errachidia")) cityId = "Errachidia";
          else if (loc.includes("zagora")) cityId = "Zagora";
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">{t("cooperatives.loading")}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button onClick={fetchCooperatives} className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition font-semibold">{t("common.retry")}</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="text-white py-14 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <p className="text-emerald-200 text-sm font-semibold uppercase tracking-widest mb-2">Drâa-Tafilalet</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3">{t("cooperatives.title")}</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">{t("cooperatives.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Region Map */}
        <div className="mb-8">
          <RegionMapPublic selected={selectedCity} onSelect={setSelectedCity} counts={counts} />
        </div>

        {/* Search + filter info */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t("cooperatives.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-10 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 text-gray-700 bg-white text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            {selectedCity && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-sm font-medium">
                📍 {PROVINCES.find((p) => p.id === selectedCity)?.labelFr}
                <button onClick={() => setSelectedCity(null)} className="hover:text-emerald-900 font-bold">✕</button>
              </span>
            )}
            <span className="text-sm text-gray-500">{filtered.length} résultat(s)</span>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600 text-xl font-semibold">{t("cooperatives.noResults")}</p>
            <p className="text-gray-400 mt-2 text-sm">Essayez de changer de région ou de recherche</p>
            <button onClick={() => { setSearchTerm(""); setSelectedCity(null); }} className="mt-6 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold text-sm">
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((coop, i) => {
              const img = getImage(coop);
              return (
                <div key={coop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-emerald-200 transform hover:-translate-y-1 transition-all duration-300" style={{ animation: `fadeUp 0.4s ease ${i * 50}ms both` }}>
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center">
                    {img ? (
                      <img src={img} alt={coop.nom} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <FaRegImage className="text-3xl mb-2" />
                        <p className="text-xs">{t("cooperatives.noImage")}</p>
                      </div>
                    )}
                    {coop.cityId && (
                      <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                        <FaMapMarkerAlt className="text-[10px]" />
                        {PROVINCES.find((p) => p.id === coop.cityId)?.labelFr || ""}
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-gray-800">{coop.nom}</h3>
                    {coop.description && <p className="text-gray-500 line-clamp-2 text-sm">{coop.description}</p>}
                    {(coop.adresse || coop.region) && (
                      <p className="text-xs text-gray-400 flex items-center gap-1"><FaMapMarkerAlt className="text-emerald-500" />{coop.adresse || coop.region}</p>
                    )}
                    {coop.tele && <p className="text-xs text-gray-400 flex items-center gap-1"><FaPhone className="text-blue-500" />{coop.tele}</p>}
                    <Link to={`/cooperatives/${coop.id}`} className="block w-full text-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition font-semibold text-sm shadow-sm mt-3">
                      {t("cooperatives.viewProducts")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </>
  );
};

export default Cooperatives;