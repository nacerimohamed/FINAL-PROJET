import React, { useEffect, useState } from "react";
import axios from "axios";
import ManagerSidebar from "./ManagerSidebar";

// Mini sparkline SVG component
const Sparkline = ({ color = "#22c55e", trend = "up" }) => {
  const points = trend === "up"
    ? "0,28 10,22 20,24 30,16 40,18 50,10 60,12 70,6 80,8 90,2"
    : "0,6 10,10 20,8 30,16 40,14 50,22 60,20 70,26 80,24 90,28";
  return (
    <svg viewBox="0 0 90 30" className="w-20 h-8 opacity-70">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Animated counter hook
const useCounter = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

// Stat card component
const StatCard = ({ icon, label, value, sub, color, trend, sparkColor, delay = 0 }) => {
  const animated = useCounter(typeof value === "number" ? value : 0);
  const colorMap = {
    emerald: { bg: "from-emerald-500 to-emerald-600", text: "text-emerald-700" },
    blue:    { bg: "from-blue-500 to-blue-600",       text: "text-blue-700"    },
    amber:   { bg: "from-amber-500 to-amber-600",     text: "text-amber-700"   },
    rose:    { bg: "from-rose-500 to-rose-600",       text: "text-rose-700"    },
    violet:  { bg: "from-violet-500 to-violet-600",   text: "text-violet-700"  },
    teal:    { bg: "from-teal-500 to-teal-600",       text: "text-teal-700"    },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <div
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 bg-gradient-to-br ${c.bg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          {trend && <Sparkline color={sparkColor} trend={trend} />}
        </div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl sm:text-4xl font-black text-gray-800 tabular-nums leading-none">
          {typeof value === "number" ? animated : value}
        </p>
        {sub && (
          <p className={`text-xs font-medium mt-2 ${c.text}`}>{sub}</p>
        )}
      </div>
      <div className={`h-1 bg-gradient-to-r ${c.bg} opacity-80`} />
    </div>
  );
};

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    if (!token) { setLoading(false); setError(true); return; }

    axios
      .get(`${API_URL}/api/manager/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const s = res.data.stats || {};
        setStats({
          total:      typeof s.products           === "number" ? s.products           : 0,
          available:  typeof s.available_products === "number" ? s.available_products : 0,
          outOfStock: typeof s.out_of_stock       === "number" ? s.out_of_stock       : 0,
          lowStock:   typeof s.low_stock          === "number" ? s.low_stock          : 0,
          categories: typeof s.categories         === "number" ? s.categories         : 0,
          orders:     typeof s.orders             === "number" ? s.orders             : 0,
        });
      })
      .catch(() => {
        setStats({ total: 0, available: 0, outOfStock: 0, lowStock: 0, categories: 0, orders: 0 });
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [token, API_URL]);

  const availablePct = stats && stats.total > 0 ? Math.round((stats.available  / stats.total) * 100) : 0;
  const outPct       = stats && stats.total > 0 ? Math.round((stats.outOfStock / stats.total) * 100) : 0;
  const lowPct       = stats && stats.total > 0 ? Math.round((stats.lowStock   / stats.total) * 100) : 0;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <ManagerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 absolute inset-0" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-emerald-600 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Chargement des statistiques…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <ManagerSidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8 lg:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Vue d'ensemble</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                  Tableau de bord{" "}
                  <span className="text-emerald-600">Produits</span>
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
              <a
                href="/manager/products"
                className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Gérer les produits
              </a>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Impossible de charger les données en temps réel — valeurs par défaut affichées.
              </div>
            )}
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
            <StatCard
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
              label="Total produits"
              value={stats?.total ?? 0}
              sub="Catalogue complet"
              color="emerald"
              trend="up"
              sparkColor="#10b981"
              delay={0}
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Disponibles"
              value={stats?.available ?? 0}
              sub={stats?.total > 0 ? `${availablePct}% du catalogue` : "En stock"}
              color="blue"
              trend="up"
              sparkColor="#3b82f6"
              delay={80}
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
              label="Rupture de stock"
              value={stats?.outOfStock ?? 0}
              sub={stats?.total > 0 ? `${outPct}% du catalogue` : "Hors stock"}
              color="rose"
              trend="down"
              sparkColor="#f43f5e"
              delay={160}
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>}
              label="Stock faible"
              value={stats?.lowStock ?? 0}
              sub={stats?.total > 0 ? `${lowPct}% à réapprovisionner` : "À surveiller"}
              color="amber"
              trend="down"
              sparkColor="#f59e0b"
              delay={240}
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
              label="Catégories"
              value={stats?.categories ?? 0}
              sub="Familles de produits"
              color="violet"
              trend="up"
              sparkColor="#8b5cf6"
              delay={320}
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
              label="Commandes"
              value={stats?.orders ?? 0}
              sub="Total reçues"
              color="teal"
              trend="up"
              sparkColor="#14b8a6"
              delay={400}
            />
          </div>

          {/* Stock Health Bar */}
          {stats && stats.total > 0 && (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Santé du stock</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Répartition par statut</p>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {stats.total} produits au total
                </span>
              </div>

              <div className="h-4 rounded-full overflow-hidden flex gap-0.5 bg-gray-100">
                {availablePct > 0 && (
                  <div
                    className="bg-blue-500 h-full rounded-l-full transition-all duration-1000"
                    style={{ width: `${availablePct}%` }}
                    title={`Disponibles: ${availablePct}%`}
                  />
                )}
                {lowPct > 0 && (
                  <div
                    className="bg-amber-400 h-full transition-all duration-1000"
                    style={{ width: `${lowPct}%` }}
                    title={`Stock faible: ${lowPct}%`}
                  />
                )}
                {outPct > 0 && (
                  <div
                    className="bg-rose-500 h-full rounded-r-full transition-all duration-1000"
                    style={{ width: `${outPct}%` }}
                    title={`Rupture: ${outPct}%`}
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                {[
                  { color: "bg-blue-500",  label: "Disponibles",  pct: availablePct },
                  { color: "bg-amber-400", label: "Stock faible", pct: lowPct       },
                  { color: "bg-rose-500",  label: "Rupture",      pct: outPct       },
                ].map(({ color, label, pct }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-bold text-gray-700">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  href: "/manager/products",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
                  label: "Voir les produits",
                  desc: "Gérer le catalogue",
                  from: "from-emerald-500", to: "to-emerald-600",
                  light: "hover:bg-emerald-50", textColor: "group-hover:text-emerald-700",
                },
                {
                  href: "/manager/products/new",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />,
                  label: "Nouveau produit",
                  desc: "Ajouter au catalogue",
                  from: "from-blue-500", to: "to-blue-600",
                  light: "hover:bg-blue-50", textColor: "group-hover:text-blue-700",
                },
                {
                  href: "/manager/stock",
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                  label: "Gérer le stock",
                  desc: "Niveaux & alertes",
                  from: "from-amber-500", to: "to-amber-600",
                  light: "hover:bg-amber-50", textColor: "group-hover:text-amber-700",
                },
              ].map(({ href, icon, label, desc, from, to, light, textColor }) => (
                <a
                  key={label}
                  href={href}
                  className={`group flex items-center gap-3 p-4 rounded-xl bg-gray-50 ${light} transition-all duration-200 hover:shadow-sm`}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${from} ${to} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 shrink-0`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold text-gray-700 ${textColor} transition-colors`}>{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;