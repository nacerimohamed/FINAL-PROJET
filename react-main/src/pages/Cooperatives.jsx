import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaPhone, FaRegImage, FaFilter } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const Cooperatives = () => {
  const { t } = useTranslation();
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Les villes disponibles
  const cities = [
    { id: "all", name: "Toutes les villes" },
    { id: "tinghir", name: "Tinghir" },
    { id: "ouarzazate", name: "Ouarzazate" },
    { id: "midelt", name: "Midelt" },
    { id: "errachidia", name: "Errachidia" },
    { id: "zagora", name: "Zagora" },
  ];

  useEffect(() => {
    fetchCooperatives();
  }, []);

  const fetchCooperatives = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/cooperatives");
      if (response.data.success) {
        let cooperativesData = response.data.data;
        
        // Ajouter cityId basé sur la région/adresse
        cooperativesData = cooperativesData.map(coop => {
          let cityId = "all";
          const location = (coop.region || coop.province || coop.adresse || coop.city || "").toLowerCase();
          
          if (location.includes("tinghir")) {
            cityId = "tinghir";
          } else if (location.includes("ouarzazate")) {
            cityId = "ouarzazate";
          } else if (location.includes("midelt")) {
            cityId = "midelt";
          } else if (location.includes("errachidia")) {
            cityId = "errachidia";
          } else if (location.includes("zagora")) {
            cityId = "zagora";
          } 
          return { ...coop, cityId };
        });
        
        setCooperatives(cooperativesData);
      }
    } catch (err) {
      setError(t('cooperatives.error'));
      console.error("Error fetching cooperatives:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCooperativeImage = (cooperative) => {
    if (cooperative.image) {
      let imageName = cooperative.image.startsWith("uploads/")
        ? cooperative.image.replace("uploads/", "")
        : cooperative.image;
      return `http://localhost:8000/uploads/${imageName}`;
    }
    return null;
  };

  // Filtrer par recherche et par ville
  const filteredCooperatives = cooperatives.filter(coop => {
    const matchesSearch = coop.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === "all" || coop.cityId === selectedCity;
    return matchesSearch && matchesCity;
  });

  // Récupérer le nom de la ville sélectionnée
  const getSelectedCityName = () => {
    const city = cities.find(c => c.id === selectedCity);
    return city ? city.name : "Toutes les villes";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4 shadow-lg"></div>
            <p className="text-gray-700 text-lg font-semibold">{t('cooperatives.loading')}</p>
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
            <button
              onClick={fetchCooperatives}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full hover:scale-105 transition font-semibold shadow-lg"
            >
              {t('common.retry')}
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

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-16 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('cooperatives.title')}</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            {t('cooperatives.subtitle')}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('cooperatives.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-full px-10 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 placeholder-gray-400 text-gray-700 transition"
            />
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-md"
          >
            <FaFilter />
            <span>Filtrer par région</span>
          </button>
        </div>

        {/* Filter Chips */}
        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 rounded-2xl shadow-inner animate-fadeIn">
            <p className="text-sm text-gray-600 mb-3 font-semibold">📍 Sélectionnez une région :</p>
            <div className="flex flex-wrap gap-3">
              {cities.map(city => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                    selectedCity === city.id
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {city.name}
                  {city.id !== "all" && selectedCity === city.id && (
                    <span className="ml-2 text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
            {selectedCity !== "all" && (
              <div className="mt-4 text-center">
                <span className="text-sm text-green-700 bg-green-100 px-4 py-2 rounded-full inline-flex items-center gap-2">
                  <span className="font-bold">{filteredCooperatives.length}</span> coopérative(s) à {getSelectedCityName()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Active filter indicator */}
        {selectedCity !== "all" && !showFilters && (
          <div className="mt-4 flex justify-center">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <span>📍 Filtre actif : {getSelectedCityName()}</span>
              <button
                onClick={() => setSelectedCity("all")}
                className="ml-2 text-green-700 hover:text-green-900 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-gray-600 text-sm">
          {filteredCooperatives.length} coopérative(s) trouvée(s)
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredCooperatives.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="text-6xl mb-4">📍</div>
            <p className="text-gray-600 text-xl">{t('cooperatives.noResults')}</p>
            <p className="text-gray-400 mt-2">Essayez de changer de région ou de recherche</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("all");
              }}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredCooperatives.map((cooperative) => {
                const imageUrl = getCooperativeImage(cooperative);
                const hasImage = imageUrl !== null;
                return (
                  <div
                    key={cooperative.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {hasImage ? (
                        <img
                          src={imageUrl}
                          alt={cooperative.nom}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <FaRegImage className="text-4xl mb-2"/>
                          <p className="text-sm font-medium">{t('cooperatives.noImage')}</p>
                        </div>
                      )}
                      {/* Badge région */}
                      {cooperative.cityId !== "all" && (
                        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          {cities.find(c => c.id === cooperative.cityId)?.name || "Région"}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6 space-y-2">
                      <h3 className="text-2xl font-bold text-gray-800">{cooperative.nom}</h3>
                      {cooperative.description && (
                        <p className="text-gray-600 line-clamp-3 text-sm">{cooperative.description}</p>
                      )}
                      {(cooperative.adresse || cooperative.region || cooperative.province) && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-green-600"/> 
                          {cooperative.adresse || cooperative.region || cooperative.province}
                        </p>
                      )}
                      {cooperative.tele && (
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <FaPhone className="text-blue-600"/> {cooperative.tele}
                        </p>
                      )}

                      <Link
                        to={`/cooperatives/${cooperative.id}`}
                        className="block w-full text-center bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-full hover:scale-105 transition font-semibold shadow"
                      >
                        {t('cooperatives.viewProducts')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reset button when filtered */}
            {(searchTerm || selectedCity !== "all") && (
              <div className="text-center mt-10">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCity("all");
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Cooperatives;