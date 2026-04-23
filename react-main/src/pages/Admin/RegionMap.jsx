
import React, { useState } from "react";
import axios from "axios";

// ============================================================
// 1. CONSTANTES — SVG paths extraits de l'image de référence
// ============================================================

const PROVINCES = [
  {
    id: "Midelt",
    label: "ميدلت",
    labelFr: "Midelt",
    color: "#bbf7d0",
    selectedColor: "#15803d",
    d: "M 10.0,80.0 L 21.4,90.0 L 29.5,80.9 L 35.5,89.1 L 45.5,88.2 L 50.9,77.3 L 63.2,70.0 L 68.2,72.7 L 75.0,70.9 L 82.7,80.5 L 98.2,77.7 L 106.8,70.9 L 120.9,75.5 L 125.5,70.9 L 135.9,71.4 L 139.5,57.3 L 133.2,51.8 L 134.5,45.9 L 126.4,41.4 L 125.5,36.4 L 112.3,41.4 L 100.0,21.8 L 85.0,24.5 L 77.3,10.9 L 63.6,10.5 L 60.5,19.5 L 53.2,19.1 L 48.6,24.5 L 48.6,44.1 L 41.8,40.0 L 42.7,50.9 L 34.1,50.0 L 30.5,53.2 L 30.5,58.6 L 36.8,60.9 L 35.9,64.5 L 27.7,63.6 L 24.1,73.2 L 13.2,71.8 Z",
  },
  {
    id: "Zagora",
    label: "زاكورة",
    labelFr: "Zagora",
    color: "#bbf7d0",
    selectedColor: "#15803d",
    d: "M 83.2,10.0 L 67.3,17.9 L 64.5,23.6 L 46.9,29.9 L 31.6,31.6 L 30.4,27.6 L 22.5,27.6 L 10.6,39.5 L 10.6,53.7 L 25.3,53.1 L 25.9,60.0 L 35.5,67.9 L 28.7,70.2 L 32.7,78.7 L 31.0,91.7 L 41.8,90.0 L 35.0,93.4 L 34.4,108.8 L 39.0,111.0 L 36.7,125.8 L 50.9,126.9 L 57.7,136.6 L 81.0,138.3 L 89.5,126.9 L 91.7,132.6 L 99.1,133.8 L 115.6,104.8 L 138.3,88.3 L 137.7,66.8 L 134.3,62.8 L 124.1,61.7 L 129.8,46.9 L 116.7,31.6 L 116.2,21.9 Z",
  },
  {
    id: "Tinghir",
    label: "تنغير",
    labelFr: "Tinghir",
    color: "#bbf7d0",
    selectedColor: "#15803d",
    d: "M 100.8,10.0 L 85.3,16.7 L 77.6,31.2 L 70.4,32.2 L 63.7,22.9 L 59.0,22.9 L 50.2,33.2 L 38.4,33.7 L 34.2,41.0 L 15.2,45.6 L 10.0,65.2 L 20.8,77.1 L 21.3,104.4 L 32.7,102.9 L 47.7,90.0 L 78.6,100.8 L 81.7,112.7 L 94.1,126.6 L 87.9,133.3 L 88.4,139.5 L 104.4,131.7 L 116.8,119.4 L 125.6,93.6 L 134.8,81.7 L 130.2,73.5 L 107.5,72.4 L 92.0,79.1 L 93.1,64.7 L 81.7,61.6 L 72.9,51.8 L 85.8,39.4 L 97.7,36.3 L 107.5,17.7 Z",
  },
  {
    id: "Ouarzazate",
    label: "ورزازات",
    labelFr: "Ouarzazate",
    color: "#319c56",
    selectedColor: "#15803d",
   d: "M 72.0,10.0 L 55.0,14.0 L 42.0,10.5 L 28.0,16.0 L 18.0,14.0 L 10.0,22.0 L 10.5,36.0 L 20.0,42.0 L 18.5,55.0 L 10.0,62.0 L 15.0,74.0 L 28.0,78.0 L 30.0,90.0 L 22.0,100.0 L 28.0,110.0 L 40.0,106.0 L 48.0,114.0 L 58.0,108.0 L 65.0,118.0 L 78.0,116.0 L 84.0,105.0 L 96.0,100.0 L 108.0,88.0 L 120.0,84.0 L 130.0,72.0 L 128.0,60.0 L 118.0,54.0 L 120.0,40.0 L 112.0,28.0 L 100.0,24.0 L 88.0,14.0 Z",
  
  },
  {
    id: "Errachidia",
    label: "الرشيدية",
    labelFr: "Errachidia",
    color: "#bbf7d0",
    selectedColor: "#15803d",
   d: "M 72.0,10.0 L 58.0,10.5 L 46.0,16.0 L 34.0,14.0 L 22.0,20.0 L 10.0,18.0 L 10.5,32.0 L 18.0,40.0 L 14.0,52.0 L 10.0,64.0 L 18.0,76.0 L 30.0,80.0 L 32.0,94.0 L 22.0,108.0 L 10.0,118.0 L 10.5,132.0 L 26.0,128.0 L 40.0,118.0 L 52.0,124.0 L 62.0,116.0 L 76.0,120.0 L 90.0,112.0 L 100.0,98.0 L 110.0,90.0 L 118.0,78.0 L 116.0,64.0 L 104.0,56.0 L 102.0,42.0 L 110.0,32.0 L 108.0,20.0 L 96.0,14.0 Z",
  },
];

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ============================================================
// 2. COMPOSANTS UI (inchangés)
// ============================================================

const ModernCard = ({ children, className = "" }) => (
  <div className={`relative bg-white rounded-2xl transition-all duration-300 ${className}`}>
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
      {children}
    </div>
  </div>
);

const ModernButton = ({ children, onClick, isActive, className = "" }) => (
  <button
    onClick={onClick}
    className={`
      relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
      transform hover:scale-105 active:scale-95
      ${isActive
        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
        : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"
      }
      ${className}
    `}
  >
    {children}
  </button>
);

const ModernIcon = ({ children, className = "" }) => (
  <div className={`relative overflow-hidden rounded-xl ${className}`}>
    {children}
  </div>
);

// ============================================================
// 3. COMPOSANT PRINCIPAL
// ============================================================

const RegionMap = () => {
  const [selected, setSelected]       = useState(null);
  const [hovered, setHovered]         = useState(null);
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const token = localStorage.getItem("token");

  const handleProvinceClick = async (provinceId) => {
    if (selected === provinceId) return;
    setSelected(provinceId);
    setCooperatives([]);
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/cooperatives?ville=${provinceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.data ?? res.data ?? [];
      setCooperatives(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des coopératives.");
    } finally {
      setLoading(false);
    }
  };

  const getProvinceFill = (province) => {
    if (province.id === selected) return "rgba(201,168,76,0.10)";
    if (province.id === hovered)  return "rgba(59,91,219,0.06)";
    return "transparent";
  };

  const getProvinceStroke = (province) => {
    if (province.id === selected) return "#a6ad46";
    if (province.id === hovered)  return "#3b5bdb";
    return "#1a2060";
  };

  return (
    <div className="mt-8 px-4">
      <ModernCard className="group">

        {/* ── Bannière supérieure identique à l'image ── */}
        <div style={{
          background: "#166141",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "10px 22px",
          borderRadius: "16px 16px 0 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontFamily: "'Cairo', 'Amiri', Arial, sans-serif",
              fontSize: 20, fontWeight: 700, color: "#fff", direction: "rtl",
            }}>
             la région
            </span>
            <span style={{ color: "#d1ce4f", fontSize: 24, fontWeight: 900, letterSpacing: "-3px", lineHeight: 1 }}>
              ///
            </span>
          </div>
        </div>

        {/* ── Contenu principal ── */}
        <div className="flex flex-col lg:flex-row">

          {/* ── Carte : provinces côte à côte comme l'image ── */}
          <div className="p-6 flex-shrink-0 w-full lg:w-auto">
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
              gap: 8,
              padding: "8px 0 4px",
            }}>
              {PROVINCES.map((province) => (
                <div
                  key={province.id}
                  onClick={() => handleProvinceClick(province.id)}
                  onMouseEnter={() => setHovered(province.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 8, cursor: "pointer", flex: 1, minWidth: 0,
                    transition: "transform 0.2s",
                    transform: hovered === province.id || selected === province.id ? "scale(1.06)" : "scale(1)",
                  }}
                >
                  {/* Label arabe au-dessus */}
                  <span style={{
                    fontFamily: "'Cairo', 'Amiri', Arial, sans-serif",
                    fontSize: 14, fontWeight: 700, direction: "rtl",
                    textAlign: "center", whiteSpace: "nowrap",
                    color: selected === province.id ? "#518a35"
                          : hovered === province.id  ? "#092180"
                          : "#1a2060",
                    transition: "color 0.2s",
                  }}>
                    {province.label}
                  </span>

                  {/* Forme SVG de la province (paths extraits de l'image) */}
                  <svg
                    viewBox="0 0 150 150"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: "100%", maxWidth: 140, display: "block" }}
                  >
                    <path
                      d={province.d}
                      fill={getProvinceFill(province)}
                      stroke={getProvinceStroke(province)}
                      strokeWidth={selected === province.id ? 2.5 : 1.8}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      style={{ transition: "stroke 0.2s, fill 0.2s, stroke-width 0.2s" }}
                    />
                  </svg>
                </div>
              ))}
            </div>

            {/* Légende boutons */}
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {PROVINCES.map((p) => (
                <ModernButton key={p.id} onClick={() => handleProvinceClick(p.id)} isActive={selected === p.id}>
                  {p.labelFr}
                </ModernButton>
              ))}
            </div>
          </div>

          {/* Séparateur */}
          <div className="hidden lg:block relative">
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-stone-200 to-transparent" />
          </div>
          <div className="lg:hidden h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent mx-8" />

          {/* ── Panneau latéral coopératives (logique inchangée) ── */}
          <div className="flex-1 p-8">
            {!selected && (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-lg font-semibold text-stone-700 mb-2">Explorez la région</p>
                <p className="text-sm text-stone-500 max-w-xs">
                  Sélectionnez une province sur la carte pour découvrir ses coopératives et leurs services
                </p>
              </div>
            )}

            {selected && (
              <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                  <div>
                    <h3 className="text-xl font-bold text-stone-800">
                      Province de{" "}
                      <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                        {PROVINCES.find((p) => p.id === selected)?.labelFr || selected}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-xs text-stone-500">
                        {loading
                          ? "Chargement en cours..."
                          : `${cooperatives.length} coopérative${cooperatives.length !== 1 ? "s" : ""} disponible${cooperatives.length !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelected(null); setCooperatives([]); }}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all duration-300 transform hover:scale-110 active:scale-95"
                    title="Désélectionner"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {loading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin" />
                      <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-600/20 rounded-full" />
                    </div>
                    <p className="text-sm text-stone-500 mt-4">Chargement des coopératives...</p>
                  </div>
                )}

                {!loading && error && (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl px-4 py-3 animate-slideIn">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700 flex-1">{error}</p>
                  </div>
                )}

                {!loading && !error && cooperatives.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-base font-medium text-stone-600 mb-1">Aucune coopérative trouvée</p>
                    <p className="text-sm text-stone-400">
                      Aucune coopérative n'est encore enregistrée dans{" "}
                      {PROVINCES.find((p) => p.id === selected)?.labelFr || selected}
                    </p>
                  </div>
                )}

                {!loading && !error && cooperatives.length > 0 && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {cooperatives.map((coop, index) => (
                      <div
                        key={coop.id}
                        className="group relative bg-white border border-stone-200 rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:border-emerald-300 hover:scale-[1.02] animate-slideIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-md group-hover:shadow-lg transition-all duration-300">
                              {coop.image ? (
                                <img
                                  src={`http://127.0.0.1:8000/${coop.image}`}
                                  alt={coop.nom}
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.target.style.display = "none")}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors duration-300">
                              {coop.nom}
                            </h4>
                            {coop.description && (
                              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{coop.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {coop.adresse && (
                                <span className="inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-50 px-2 py-1 rounded-lg">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  </svg>
                                  {coop.adresse}
                                </span>
                              )}
                              {coop.region && (
                                <span className="inline-flex text-xs bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 rounded-lg px-2 py-1 font-medium">
                                  {coop.region}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Barre de bas */}
        <div style={{ height: 6, background: "#688052", borderRadius: "0 0 16px 16px" }} />
      </ModernCard>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .animate-fadeIn  { animation: fadeIn  0.5s ease-out; }
        .animate-slideIn { animation: slideIn 0.4s ease-out forwards; opacity: 0; }

        .custom-scrollbar::-webkit-scrollbar       { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
};

export default RegionMap;