import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CooperativeSidebar from "./CooperativeSidebar";

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
    blue: { bg: "from-blue-500 to-blue-600", text: "text-blue-700" },
    amber: { bg: "from-amber-500 to-amber-600", text: "text-amber-700" },
    rose: { bg: "from-rose-500 to-rose-600", text: "text-rose-700" },
    violet: { bg: "from-violet-500 to-violet-600", text: "text-violet-700" },
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

const CooperativeDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ ...user, password: "" });
  const [imageFile, setImageFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (!token) { setLoading(false); setError(true); return; }

    axios
      .get("http://localhost:8000/api/cooperative/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const s = res.data.stats || {};
        setStats({
          total: s.total ?? 0,
          available: s.available ?? 0,
          lowStock: s.low_stock ?? 0,
          outOfStock: s.out_of_stock ?? 0,
          categories: s.categories ?? 0,
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");

    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key]) formData.append(key, profileData[key]);
      });
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.post("http://localhost:8000/api/cooperative/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setShowProfileModal(false);
        setImageFile(null);
        alert("Profil mis à jour avec succès!");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setProfileError(firstError);
      } else {
        setProfileError("Erreur lors de la mise à jour du profil.");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const availablePct = stats && stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0;
  const lowPct = stats && stats.total > 0 ? Math.round((stats.lowStock / stats.total) * 100) : 0;
  const outPct = stats && stats.total > 0 ? Math.round((stats.outOfStock / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <CooperativeSidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-green-100 flex items-center justify-center">
                {user.image ? (
                  <img src={user.image.startsWith('http') ? user.image : `http://localhost:8000/storage/${user.image}`} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-green-700">{user.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Espace Privé</p>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  Bonjour, <span className="text-green-600">{user.name}</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition"
              >
                Modifier Profil
              </button>
              <Link
                to="/cooperative/products"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition"
              >
                Gérer les produits
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            <StatCard
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
              label="Total Produits"
              value={stats?.total ?? 0}
              color="emerald"
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Disponibles"
              value={stats?.available ?? 0}
              color="blue"
            />
            <StatCard
              icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Stock Faible"
              value={stats?.lowStock ?? 0}
              color="amber"
            />
          
          </div>

          {/* Stock Health */}
          {stats && stats.total > 0 && (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6 mb-6">
              <h2 className="text-sm font-bold text-gray-800 mb-4">État de votre stock</h2>
              <div className="h-4 rounded-full overflow-hidden flex gap-0.5 bg-gray-100">
                {availablePct > 0 && <div className="bg-blue-500 h-full rounded-l-full transition-all" style={{ width: `${availablePct}%` }} />}
                {lowPct > 0 && <div className="bg-amber-400 h-full transition-all" style={{ width: `${lowPct}%` }} />}
                {outPct > 0 && <div className="bg-rose-500 h-full rounded-r-full transition-all" style={{ width: `${outPct}%` }} />}
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-xs text-gray-500">Disponibles ({availablePct}%)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400" /><span className="text-xs text-gray-500">Faible ({lowPct}%)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /><span className="text-xs text-gray-500">Rupture ({outPct}%)</span></div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifier le Profil de la Coopérative</h2>

              {profileError && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">{profileError}</div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                    <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required className="w-full border rounded-lg p-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} required className="w-full border rounded-lg p-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Téléphone / WhatsApp</label>
                    <input type="text" name="tele" value={profileData.tele || ""} onChange={handleProfileChange} className="w-full border rounded-lg p-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe (optionnel)</label>
                    <input type="password" name="password" value={profileData.password || ""} onChange={handleProfileChange} placeholder="Laisser vide pour ne pas modifier" className="w-full border rounded-lg p-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse (Province, Ville)</label>
                  <input type="text" name="adresse" value={profileData.adresse || ""} onChange={handleProfileChange} className="w-full border rounded-lg p-2 focus:ring-green-500 focus:border-green-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description de la coopérative</label>
                  <textarea name="description" value={profileData.description || ""} onChange={handleProfileChange} rows="3" className="w-full border rounded-lg p-2 focus:ring-green-500 focus:border-green-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Logo / Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full border rounded-lg p-2" />
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button type="button" onClick={() => setShowProfileModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
                  <button type="submit" disabled={profileLoading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                    {profileLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CooperativeDashboard;
