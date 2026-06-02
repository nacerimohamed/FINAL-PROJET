// src/pages/Admin/AdminCooperatives.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminCooperatives = () => {
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCooperative, setEditingCooperative] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [formData, setFormData] = useState({
    name: "",           // nom
    email: "",
    ville: "",
    description: "",
    address: "",        // adresse
    contact: "",
    tele: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
    latitude: "",
    longitude: "",
    google_maps_link: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Configuration axios
  const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const apiFormData = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  // Récupérer toutes les coopératives
  const fetchCooperatives = async () => {
    try {
      const response = await api.get("/admin/cooperatives");
      // Adaptation selon la structure retournée par le backend
      const data = response.data.success ? response.data.data : response.data;
      setCooperatives(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des coopératives:", error);
      toast.error("Erreur lors du chargement des coopératives");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCooperatives();
  }, []);

  // Nettoyage des URLs objet
  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith(API_URL)) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview && !imagePreview.startsWith(API_URL)) {
        URL.revokeObjectURL(imagePreview);
      }

      setFormData({
        ...formData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCooperative = () => {
    setEditingCooperative(null);
    setFormData({
      name: "",
      email: "",
      ville: "",
      description: "",
      address: "",
      contact: "",
      tele: "",
      instagram: "",
      facebook: "",
      whatsapp: "",
      latitude: "",
      longitude: "",
      google_maps_link: "",
      image: null,
    });

    if (imagePreview && !imagePreview.startsWith(API_URL)) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setModalOpen(true);
  };

  const handleEditCooperative = (cooperative) => {
    setEditingCooperative(cooperative);
    setFormData({
      name: cooperative.name || cooperative.nom || "",
      email: cooperative.email || "",
      ville: cooperative.ville || "",
      description: cooperative.description || "",
      address: cooperative.address || cooperative.adresse || "",
      contact: cooperative.contact || "",
      tele: cooperative.tele || "",
      instagram: cooperative.instagram || "",
      facebook: cooperative.facebook || "",
      whatsapp: cooperative.whatsapp || "",
      latitude: cooperative.latitude || "",
      longitude: cooperative.longitude || "",
      google_maps_link: cooperative.google_maps_link || "",
      image: null,
    });

    if (cooperative.image) {
      setImagePreview(`${API_URL}/storage/${cooperative.image}`);
    } else {
      setImagePreview(null);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Ajouter tous les champs
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingCooperative) {
        formDataToSend.append("_method", "PUT");
        const response = await apiFormData.post(
          `/admin/cooperatives/${editingCooperative.id}`,
          formDataToSend
        );
        if (response.data.success) {
          toast.success(response.data.message || "Coopérative mise à jour");
        } else {
          toast.success("Coopérative mise à jour");
        }
      } else {
        const response = await apiFormData.post("/admin/cooperatives", formDataToSend);
        if (response.data.success) {
          toast.success(response.data.message || "Coopérative ajoutée");
        } else {
          toast.success("Coopérative ajoutée");
        }
      }
      setModalOpen(false);
      fetchCooperatives();

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        ville: "",
        description: "",
        address: "",
        contact: "",
        tele: "",
        instagram: "",
        facebook: "",
        whatsapp: "",
        latitude: "",
        longitude: "",
        google_maps_link: "",
        image: null,
      });

      if (imagePreview && !imagePreview.startsWith(API_URL)) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setEditingCooperative(null);

    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((err) => {
          toast.error(Array.isArray(err) ? err[0] : err);
        });
      } else {
        toast.error(error.response?.data?.message || "Une erreur est survenue");
      }
    }
  };

  const handleDeleteCooperative = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette coopérative ?")) {
      try {
        await api.delete(`/admin/cooperatives/${id}`);
        toast.success("Coopérative supprimée");
        fetchCooperatives();
      } catch (error) {
        console.error("Erreur suppression:", error);
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  // Filtrer les coopératives
  const filteredCooperatives = cooperatives.filter(coop =>
    coop.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coop.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coop.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coop.adresse?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCooperatives.length / itemsPerPage);
  const paginatedCooperatives = filteredCooperatives.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${API_URL}/storage/${imagePath}`;
  };

  const DefaultCoopIcon = ({ size = "12" }) => (
    <div className={`h-${size} w-${size} rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center border border-green-200 shadow-sm`}>
      <svg className={`w-${size === "10" ? "5" : "6"} h-${size === "10" ? "5" : "6"} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des coopératives...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminSidebar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className="mt-16 z-50"
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Gestion des Coopératives
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredCooperatives.length} coopérative
                {filteredCooperatives.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={handleAddCooperative}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une coopérative
            </button>
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom, email, contact ou adresse..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Liste */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {filteredCooperatives.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">
                  {searchTerm
                    ? "Aucune coopérative ne correspond à votre recherche"
                    : "Aucune coopérative enregistrée"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleAddCooperative}
                    className="mt-4 text-green-600 hover:text-green-700 font-medium"
                  >
                    + Ajouter une coopérative
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Version mobile : cartes */}
                <div className="block sm:hidden divide-y divide-gray-200">
                  {paginatedCooperatives.map((coop) => (
                    <div key={coop.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="flex-shrink-0">
                          {coop.image ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                              src={getImageUrl(coop.image)}
                              alt={coop.nom}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div class="h-12 w-12 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center border border-green-200 shadow-sm"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>';
                              }}
                            />
                          ) : (
                            <DefaultCoopIcon />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{coop.name || coop.nom}</h3>
                          {coop.description && (
                            <p className="text-xs text-gray-500 truncate">{coop.description}</p>
                          )}
                          <p className="text-xs text-gray-600 mt-1 truncate">{coop.email}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {coop.contact && (
                          <div className="flex items-center text-xs text-gray-600">
                            <svg className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {coop.contact}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleEditCooperative(coop)}
                              className="flex items-center text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteCooperative(coop.id)}
                              className="flex items-center text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-100 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Version desktop : tableau */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Coopérative
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact / Tél
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedCooperatives.map((coop) => (
                        <tr key={coop.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {coop.image ? (
                                <img
                                  src={getImageUrl(coop.image)}
                                  alt={coop.name || coop.nom}
                                  className="h-10 w-10 rounded-lg object-cover mr-3 shadow-sm"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="h-10 w-10 mr-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center border border-green-200 shadow-sm"><svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>' + e.target.parentElement.innerHTML;
                                  }}
                                />
                              ) : (
                                <div className="mr-3">
                                  <DefaultCoopIcon size="10" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {coop.name || coop.nom}
                                </div>
                                {coop.ville && (
                                  <div className="text-xs text-gray-500">{coop.ville}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {coop.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {coop.contact && <div className="flex items-center gap-1"><svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> {coop.contact}</div>}
                            {coop.tele && <div className="flex items-center gap-1 mt-1"><svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> {coop.tele}</div>}
                            {!coop.contact && !coop.tele && "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditCooperative(coop)}
                                className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                
                              </button>
                              <button
                                onClick={() => handleDeleteCooperative(coop.id)}
                                className="flex items-center text-red-600 hover:text-red-900 transition-colors"
                                title="Supprimer"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Pagination réelle */}
          {filteredCooperatives.length > 0 && (
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredCooperatives.length)}</span> sur <span className="font-medium">{filteredCooperatives.length}</span> coopératives
              </p>
              <div className="flex gap-2 order-1 sm:order-2 items-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Précédent
                </button>
                <span className="text-sm text-gray-600 font-medium px-2 py-1 bg-gray-100 rounded-md">Page {currentPage} / {totalPages || 1}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
                >
                  Suivant
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal responsive */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* En-tête sticky */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-4">
                {editingCooperative ? "Modifier la Coopérative" : "Ajouter une Coopérative"}
              </h3>
              <button
                onClick={() => {
                  if (imagePreview && !imagePreview.startsWith(API_URL)) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  setModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Nom */}
                <div className="sm:col-span-1 group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                      required
                      placeholder="Nom de la coopérative"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-1 group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm ${editingCooperative ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                      required
                      disabled={editingCooperative}
                      placeholder="contact@cooperative.com"
                    />
                  </div>
                </div>

                {/* Ville */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Ville
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <select
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm appearance-none bg-white"
                    >
                      <option value="">Choisir une ville</option>
                      <option value="Midelt">Midelt</option>
                      <option value="Errachidia">Errachidia</option>
                      <option value="Tinghir">Tinghir</option>
                      <option value="Ouarzazate">Ouarzazate</option>
                      <option value="Zagora">Zagora</option>
                    </select>
                  </div>
                </div>

                {/* Contact */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Contact (Responsable)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                      placeholder="Nom du responsable"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="tele"
                      value={formData.tele}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    WhatsApp
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                      placeholder="ex: 212XXXXXXXXX"
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div className="sm:col-span-2 group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Adresse complète
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                      placeholder="Adresse complète"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2 group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all shadow-sm"
                    placeholder="Description de la coopérative..."
                  />
                </div>

                {/* Instagram & Facebook */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Instagram
                  </label>
                  <div className="flex shadow-sm rounded-xl">
                    <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-xl text-gray-500 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="nom_utilisateur"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Facebook
                  </label>
                  <div className="relative shadow-sm rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Lien de la page Facebook"
                    />
                  </div>
                </div>


                {/* Google Maps Link */}
                <div className="sm:col-span-2 group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 group-focus-within:text-green-600 transition-colors">
                    Lien Google Maps
                  </label>
                  <div className="relative shadow-sm rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="google_maps_link"
                      value={formData.google_maps_link}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="URL Google Maps"
                    />
                  </div>
                </div>

                {/* Image */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Logo / Image de la coopérative
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-2 text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Cliquez pour ajouter</span> ou glissez une image</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG ou GIF (MAX. 2MB)</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Aperçu image */}
                {imagePreview && (
                  <div className="sm:col-span-2 flex justify-center mt-2">
                    <div className="relative inline-block rounded-xl shadow-md p-1 border border-gray-200 bg-white">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (imagePreview && !imagePreview.startsWith(API_URL)) {
                            URL.revokeObjectURL(imagePreview);
                          }
                          setImagePreview(null);
                          setFormData({ ...formData, image: null });
                        }}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  {editingCooperative ? "Mettre à jour" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCooperatives;