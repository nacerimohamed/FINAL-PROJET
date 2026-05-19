import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Chart, ArcElement, DoughnutController, Tooltip, Legend } from "chart.js";
import { FiX } from "react-icons/fi";

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

// ============================================================
// 1. CONSTANTES
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

const CHART_COLORS = ["#0F6E56", "#1D9E75", "#5DCAA5", "#9FE1CB", "#C0DD97"];
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ============================================================
// 2. COMPOSANTS UI
// ============================================================

const ModernCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const ModernButton = ({ children, onClick, isActive, className = "" }) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200
      transform active:scale-95 whitespace-nowrap
      ${isActive
        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
        : "bg-stone-50 text-stone-600 border border-stone-200 hover:border-emerald-300 hover:text-emerald-700"
      }
      ${className}
    `}
  >
    {children}
  </button>
);

// ============================================================
// 3. COMPOSANT DOUGHNUT CHART
// ============================================================

const CoopDoughnutChart = ({ statsData, selectedProvince, onProvinceClick }) => {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const total = statsData.reduce((s, d) => s + d.count, 0);

  useEffect(() => {
    if (!canvasRef.current || !statsData.length) return;

    const bgs = statsData.map((d, i) =>
      selectedProvince && d.id !== selectedProvince
        ? CHART_COLORS[i] + "55"
        : CHART_COLORS[i]
    );

    if (chartRef.current) {
      chartRef.current.data.datasets[0].data = statsData.map((d) => d.count);
      chartRef.current.data.datasets[0].backgroundColor = bgs;
      chartRef.current.update("active");
      return;
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: statsData.map((d) => d.labelFr),
        datasets: [{
          data: statsData.map((d) => d.count),
          backgroundColor: bgs,
          borderColor: "#fff",
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#fff",
            titleColor: "#1f2937",
            bodyColor: "#4b5563",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            cornerRadius: 8,
          }
        },
        onClick: (_, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            onProvinceClick(statsData[idx].id);
          }
        }
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [statsData]);

  useEffect(() => {
    if (!chartRef.current) return;
    const bgs = statsData.map((d, i) =>
      selectedProvince && d.id !== selectedProvince
        ? CHART_COLORS[i] + "55"
        : CHART_COLORS[i]
    );
    chartRef.current.data.datasets[0].backgroundColor = bgs;
    chartRef.current.update("active");
  }, [selectedProvince]);

  const selectedData = statsData.find((d) => d.id === selectedProvince);

  return (
    <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Répartition</span>
        <span className="text-xs text-gray-500 font-medium">
          {selectedProvince ? `${selectedData?.labelFr} · ${selectedData?.count} coops` : `${total} au total`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="relative w-28 h-28 mx-auto flex-shrink-0">
          <canvas ref={canvasRef} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl font-black text-emerald-800 leading-none">
              {selectedProvince ? selectedData?.count ?? 0 : total}
            </span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
              {selectedProvince ? selectedProvince : "Total"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          {statsData.map((d, i) => {
            const isActive = selectedProvince === d.id;
            return (
              <div
                key={d.id}
                onClick={() => onProvinceClick(d.id)}
                className={`flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-colors text-xs font-bold ${isActive ? 'bg-emerald-100/50' : 'hover:bg-gray-100/50'}`}
                style={{ opacity: selectedProvince && !isActive ? 0.5 : 1 }}
              >
                <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: CHART_COLORS[i] }} />
                <span className="flex-1 text-gray-700 truncate">{d.labelFr}</span>
                <span className="text-emerald-700 font-extrabold text-right">{isActive ? d.count : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 4. COMPOSANT PRINCIPAL
// ============================================================

const RegionMap = () => {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [statsData, setStatsData] = useState(
    PROVINCES.map((p) => ({ ...p, count: 0 }))
  );

  const token = localStorage.getItem("token");

  const handleProvinceClick = async (provinceId) => {
    if (selected === provinceId) {
      setSelected(null);
      setCooperatives([]);
      setStatsData(PROVINCES.map((p) => ({ ...p, count: 0 })));
      return;
    }

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
      const coops = Array.isArray(data) ? data : [];
      setCooperatives(coops);

      setStatsData(
        PROVINCES.map((p) => ({
          ...p,
          count: p.id === provinceId ? coops.length : 0,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des coopératives.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 px-4">
      <ModernCard>
        
        {/* Top Header Banner */}
        <div className="bg-emerald-700 flex justify-end items-center px-6 py-3 border-b-2 border-emerald-600">
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-black text-white tracking-wide">
              la région
            </span>
            <span className="text-yellow-400 text-xl font-black tracking-tighter">///</span>
          </div>
        </div>

        {/* Grid Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:divide-stone-100">
          
          {/* Left Block */}
          <div className="lg:col-span-5 p-4 md:p-6 flex flex-col justify-between w-full overflow-hidden">
            <CoopDoughnutChart
              statsData={statsData}
              selectedProvince={selected}
              onProvinceClick={handleProvinceClick}
            />

            <div className="grid grid-cols-5 gap-1.5 py-4 items-end">
              {PROVINCES.map((province) => {
                const isSel = selected === province.id;
                const isHov = hovered === province.id;
                return (
                  <div
                    key={province.id}
                    onClick={() => handleProvinceClick(province.id)}
                    onMouseEnter={() => setHovered(province.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex flex-col items-center gap-2 cursor-pointer transition-transform duration-200"
                    style={{ transform: isHov || isSel ? "scale(1.05)" : "scale(1)" }}
                  >
                    <span className={`text-xs font-bold text-center tracking-tight truncate w-full ${isSel ? 'text-emerald-600' : isHov ? 'text-blue-700' : 'text-slate-700'}`}>
                      {province.label}
                    </span>

                    <svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
                      <path
                        d={province.d}
                        fill={isSel ? "rgba(21,128,61,0.1)" : isHov ? "rgba(59,91,219,0.06)" : "transparent"}
                        stroke={isSel ? "#15803d" : isHov ? "#3b5bdb" : "#334155"}
                        strokeWidth={isSel ? 2.5 : 1.8}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="transition-all duration-200"
                      />
                    </svg>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center mt-4">
              {PROVINCES.map((p) => (
                <ModernButton
                  key={p.id}
                  onClick={() => handleProvinceClick(p.id)}
                  isActive={selected === p.id}
                >
                  {p.labelFr}
                </ModernButton>
              ))}
            </div>
          </div>

          {/* Right Block */}
          <div className="lg:col-span-7 p-6 md:p-8 bg-stone-50/40 w-full overflow-hidden">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center">
                <div className="relative w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-emerald-100">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">Explorez la région</h3>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Sélectionnez une province sur la carte pour découvrir ses coopératives et leurs services
                </p>
              </div>
            ) : (
              <div className="animate-fadeIn flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200/60">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Province de <span className="text-emerald-700">{PROVINCES.find((p) => p.id === selected)?.labelFr}</span>
                      </h3>
                      <p className="text-[11px] text-gray-400 font-bold mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        {loading ? "Chargement..." : `${cooperatives.length} coopératives enregistrées`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelected(null);
                        setCooperatives([]);
                        setStatsData(PROVINCES.map((p) => ({ ...p, count: 0 })));
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-stone-100 transition-colors"
                    >
                      <FiX className="text-lg" />
                    </button>
                  </div>

                  {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-10 h-10 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin" />
                    </div>
                  )}

                  {!loading && error && <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

                  {!loading && !error && cooperatives.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-sm font-bold text-gray-500">Aucune donnée disponible</p>
                    </div>
                  )}

                  {!loading && !error && cooperatives.length > 0 && (
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                      {cooperatives.map((coop, index) => (
                        <div
                          key={coop.id}
                          className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all transform hover:scale-[1.01]"
                          style={{ animation: `fadeIn 0.3s ease-out ${index * 30}ms both` }}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {coop.image ? (
                                <img src={`${API_URL}/${coop.image}`} alt={coop.nom} className="w-full h-full object-cover" />
                              ) : (
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-800 truncate">{coop.nom}</h4>
                              {coop.description && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{coop.description}</p>}
                              <div className="flex gap-2 mt-2">
                                {coop.adresse && <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-gray-500 rounded-md truncate max-w-[150px]">{coop.adresse}</span>}
                                {coop.region && <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">{coop.region}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Accent Line */}
        <div className="h-1.5 bg-emerald-800" />
      </ModernCard>

      {/* Embedded Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}</style>
    </div>
  );
};

export default RegionMap;