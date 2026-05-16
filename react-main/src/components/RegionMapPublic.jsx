import React, { useState } from "react";

const PROVINCES = [
  { id: "Midelt", label: "ميدلت", labelFr: "Midelt",
    d: "M 10.0,80.0 L 21.4,90.0 L 29.5,80.9 L 35.5,89.1 L 45.5,88.2 L 50.9,77.3 L 63.2,70.0 L 68.2,72.7 L 75.0,70.9 L 82.7,80.5 L 98.2,77.7 L 106.8,70.9 L 120.9,75.5 L 125.5,70.9 L 135.9,71.4 L 139.5,57.3 L 133.2,51.8 L 134.5,45.9 L 126.4,41.4 L 125.5,36.4 L 112.3,41.4 L 100.0,21.8 L 85.0,24.5 L 77.3,10.9 L 63.6,10.5 L 60.5,19.5 L 53.2,19.1 L 48.6,24.5 L 48.6,44.1 L 41.8,40.0 L 42.7,50.9 L 34.1,50.0 L 30.5,53.2 L 30.5,58.6 L 36.8,60.9 L 35.9,64.5 L 27.7,63.6 L 24.1,73.2 L 13.2,71.8 Z" },
  { id: "Zagora", label: "زاكورة", labelFr: "Zagora",
    d: "M 83.2,10.0 L 67.3,17.9 L 64.5,23.6 L 46.9,29.9 L 31.6,31.6 L 30.4,27.6 L 22.5,27.6 L 10.6,39.5 L 10.6,53.7 L 25.3,53.1 L 25.9,60.0 L 35.5,67.9 L 28.7,70.2 L 32.7,78.7 L 31.0,91.7 L 41.8,90.0 L 35.0,93.4 L 34.4,108.8 L 39.0,111.0 L 36.7,125.8 L 50.9,126.9 L 57.7,136.6 L 81.0,138.3 L 89.5,126.9 L 91.7,132.6 L 99.1,133.8 L 115.6,104.8 L 138.3,88.3 L 137.7,66.8 L 134.3,62.8 L 124.1,61.7 L 129.8,46.9 L 116.7,31.6 L 116.2,21.9 Z" },
  { id: "Tinghir", label: "تنغير", labelFr: "Tinghir",
    d: "M 100.8,10.0 L 85.3,16.7 L 77.6,31.2 L 70.4,32.2 L 63.7,22.9 L 59.0,22.9 L 50.2,33.2 L 38.4,33.7 L 34.2,41.0 L 15.2,45.6 L 10.0,65.2 L 20.8,77.1 L 21.3,104.4 L 32.7,102.9 L 47.7,90.0 L 78.6,100.8 L 81.7,112.7 L 94.1,126.6 L 87.9,133.3 L 88.4,139.5 L 104.4,131.7 L 116.8,119.4 L 125.6,93.6 L 134.8,81.7 L 130.2,73.5 L 107.5,72.4 L 92.0,79.1 L 93.1,64.7 L 81.7,61.6 L 72.9,51.8 L 85.8,39.4 L 97.7,36.3 L 107.5,17.7 Z" },
  { id: "Ouarzazate", label: "ورزازات", labelFr: "Ouarzazate",
    d: "M 72.0,10.0 L 55.0,14.0 L 42.0,10.5 L 28.0,16.0 L 18.0,14.0 L 10.0,22.0 L 10.5,36.0 L 20.0,42.0 L 18.5,55.0 L 10.0,62.0 L 15.0,74.0 L 28.0,78.0 L 30.0,90.0 L 22.0,100.0 L 28.0,110.0 L 40.0,106.0 L 48.0,114.0 L 58.0,108.0 L 65.0,118.0 L 78.0,116.0 L 84.0,105.0 L 96.0,100.0 L 108.0,88.0 L 120.0,84.0 L 130.0,72.0 L 128.0,60.0 L 118.0,54.0 L 120.0,40.0 L 112.0,28.0 L 100.0,24.0 L 88.0,14.0 Z" },
  { id: "Errachidia", label: "الرشيدية", labelFr: "Errachidia",
    d: "M 72.0,10.0 L 58.0,10.5 L 46.0,16.0 L 34.0,14.0 L 22.0,20.0 L 10.0,18.0 L 10.5,32.0 L 18.0,40.0 L 14.0,52.0 L 10.0,64.0 L 18.0,76.0 L 30.0,80.0 L 32.0,94.0 L 22.0,108.0 L 10.0,118.0 L 10.5,132.0 L 26.0,128.0 L 40.0,118.0 L 52.0,124.0 L 62.0,116.0 L 76.0,120.0 L 90.0,112.0 L 100.0,98.0 L 110.0,90.0 L 118.0,78.0 L 116.0,64.0 L 104.0,56.0 L 102.0,42.0 L 110.0,32.0 L 108.0,20.0 L 96.0,14.0 Z" },
];

const RegionMapPublic = ({ selected, onSelect, counts = {} }) => {
  const [hovered, setHovered] = useState(null);

  const getFill = (p) => {
    if (p.id === selected) return "rgba(201,168,76,0.10)";
    if (p.id === hovered) return "rgba(59,91,219,0.06)";
    return "transparent";
  };
  const getStroke = (p) => {
    if (p.id === selected) return "#a6ad46";
    if (p.id === hovered) return "#3b5bdb";
    return "#1a2060";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Banner */}
      <div style={{ background: "#166141", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px" }}>
        <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>🗺️ Explorer par province</span>
        {selected && (
          <button onClick={() => onSelect(null)} style={{ color: "#d1ce4f", fontSize: 13, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
            ✕ Réinitialiser
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map */}
        <div className="p-6 flex-shrink-0 w-full lg:w-auto">
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", gap: 8, padding: "8px 0 4px" }}>
            {PROVINCES.map((province) => (
              <div
                key={province.id}
                onClick={() => onSelect(selected === province.id ? null : province.id)}
                onMouseEnter={() => setHovered(province.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 6, cursor: "pointer", flex: 1, minWidth: 0,
                  transition: "transform 0.2s",
                  transform: hovered === province.id || selected === province.id ? "scale(1.06)" : "scale(1)",
                }}
              >
                <span style={{
                  fontFamily: "'Cairo', 'Amiri', Arial, sans-serif",
                  fontSize: 13, fontWeight: 700, direction: "rtl",
                  textAlign: "center", whiteSpace: "nowrap",
                  color: selected === province.id ? "#518a35" : hovered === province.id ? "#092180" : "#1a2060",
                  transition: "color 0.2s",
                }}>{province.label}</span>

                <svg viewBox="0 0 150 150" style={{ width: "100%", maxWidth: 130, display: "block" }}>
                  <path
                    d={province.d}
                    fill={getFill(province)}
                    stroke={getStroke(province)}
                    strokeWidth={selected === province.id ? 2.5 : 1.8}
                    strokeLinejoin="round" strokeLinecap="round"
                    style={{ transition: "all 0.2s" }}
                  />
                </svg>

                {/* Count badge */}
                {counts[province.id] !== undefined && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                    background: selected === province.id ? "#166141" : "#f0fdf4",
                    color: selected === province.id ? "#fff" : "#166141",
                  }}>
                    {counts[province.id]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Province buttons */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {PROVINCES.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(selected === p.id ? null : p.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selected === p.id
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300 hover:text-emerald-700"
                }`}
              >
                {p.labelFr}
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-stone-200 to-transparent" />
        <div className="lg:hidden h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent mx-6" />

        {/* Info panel */}
        <div className="flex-1 p-6 flex flex-col justify-center min-h-[280px]">
          {!selected ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-stone-700 mb-2">Explorez la région</p>
              <p className="text-sm text-stone-500 max-w-xs mx-auto">Sélectionnez une province sur la carte pour filtrer les coopératives</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                Province de{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  {PROVINCES.find((p) => p.id === selected)?.labelFr}
                </span>
              </h3>
              <p className="text-sm text-stone-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                {counts[selected] ?? 0} coopérative(s) trouvée(s)
              </p>
              <p className="text-xs text-stone-400 mt-3">Les résultats sont filtrés ci-dessous</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 5, background: "#688052" }} />
    </div>
  );
};

export { PROVINCES };
export default RegionMapPublic;
