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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${API_URL}/storage/${imagePath}`;
  };

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
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow flex items-center gap-2 transition"
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  {filteredCooperatives.map((cooperative) => (
                    <div key={cooperative.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="flex-shrink-0">
                          {cooperative.image ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                              src={getImageUrl(cooperative.image)}
                              alt={cooperative.nom}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{cooperative.nom}</h3>
                          {cooperative.description && (
                            <p className="text-xs text-gray-500 truncate">{cooperative.description}</p>
                          )}
                          <p className="text-xs text-gray-600 mt-1 truncate">{cooperative.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {cooperative.contact && (
                          <div className="flex items-center text-xs text-gray-600">
                            <svg className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900">
                              {coop.name || coop.nom}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                coop.is_approved
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {coop.is_approved ? "Approuvée" : "En attente"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{coop.email}</p>
                          {coop.contact && (
                            <p className="text-xs text-gray-500 mt-1">Contact : {coop.contact}</p>
                          )}
                          <div className="flex gap-2 mt-3">
                            {!coop.is_approved && (
                              <button
                                onClick={() => handleApprove(coop.id, false)}
                                className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                              >
                                Approuver
                              </button>
                            )}
                            <button
                              onClick={() => handleEditCooperative(coop)}
                              className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteCooperative(coop.id)}
                              className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded"
                            >
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
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCooperatives.map((coop) => (
                        <tr key={coop.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {coop.image ? (
                                <img
                                  src={getImageUrl(coop.image)}
                                  alt={coop.name || coop.nom}
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                />
                              ) : (
                                <div className="h-10 w-10 bg-gray-100 rounded-lg mr-3 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
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
                            {coop.contact && <div>📞 {coop.contact}</div>}
                            {coop.tele && <div>📱 {coop.tele}</div>}
                            {!coop.contact && !coop.tele && "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                coop.is_approved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {coop.is_approved ? "Approuvée" : "En attente"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              {!coop.is_approved && (
                                <button
                                  onClick={() => handleApprove(coop.id, false)}
                                  className="text-green-600 hover:text-green-900 font-medium"
                                >
                                  Approuver
                                </button>
                              )}
                              <button
                                onClick={() => handleEditCooperative(coop)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteCooperative(coop.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Supprimer
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

          {/* Pagination simple */}
          {filteredCooperatives.length > 0 && (
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredCooperatives.length}</span> sur <span className="font-medium">{cooperatives.length}</span> coopératives
              </p>
              <div className="flex gap-2 order-1 sm:order-2">
                <button className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-xs sm:text-sm disabled:opacity-50" disabled>
                  Précédent
                </button>
                <button className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-xs sm:text-sm disabled:opacity-50" disabled>
                  Suivant
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
            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Nom */}
                <div className="sm:col-span-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    placeholder="Nom de la coopérative"
                  />
                </div>
                
                {/* Email */}
                <div className="sm:col-span-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      editingCooperative ? 'bg-gray-100' : ''
                    }`}
                    required
                    disabled={editingCooperative}
                    placeholder="contact@cooperative.com"
                  />
                </div>
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Ville
  </label>

  <select
    name="ville"
    value={formData.ville}
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded-lg"
  >
    <option value="">Choisir ville</option>
    <option value="Midelt">Midelt</option>
    <option value="Errachidia">Errachidia</option>
    <option value="Tinghir">Tinghir</option>
    <option value="Ouarzazate">Ouarzazate</option>
    <option value="Zagora">Zagora</option>
  </select>
</div>
                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Description de la coopérative..."
                  />
                </div>

                {/* Adresse */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Adresse complète"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Personne à contacter"
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    name="tele"
                    value={formData.tele}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Numéro de téléphone"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="instagram"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="URL Facebook"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="212XXXXXXXXX"
                  />
                </div>

                {/* Latitude & Longitude */}
                <div className="sm:col-span-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="ex: 31.5085"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="ex: -5.5228"
                  />
                </div>

                {/* Google Maps Link */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Lien Google Maps
                  </label>
                  <input
                    type="text"
                    name="google_maps_link"
                    value={formData.google_maps_link}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="URL Google Maps"
                  />
                </div>

                {/* Image */}
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Image de la coopérative
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Formats acceptés : JPG, PNG, GIF. Taille max : 2MB
                  </p>
                </div>

                {/* Aperçu image */}
                {imagePreview && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Aperçu
                    </label>
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
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
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {editingCooperative ? "Mettre à jour" : "Créer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCooperatives;