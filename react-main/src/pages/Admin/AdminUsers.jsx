// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
    address: "",
    image: null
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "manager",
    address: "",
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      const res = await api.get("/admin/users");
      console.log("Users fetched:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      console.error("Error response:", err.response);
      alert("Impossible de récupérer les utilisateurs: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    setEditFormData({ ...editFormData, image: file });
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setEditPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);
      data.append('address', formData.address);
      if (formData.image) {
        data.append('image', formData.image);
      }

      console.log("Creating user...");
      await axios.post(`${API_URL}/api/admin/users`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      alert("Utilisateur créé avec succès !");
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      console.error("Error response:", err.response?.data);
      alert("Erreur lors de la création de l'utilisateur: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (user) => {
    try {
      console.log("Editing user ID:", user.id);
      setCurrentUser(user);
      
      setEditFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address || "",
        image: null
      });
      
      if (user.image) {
        const imageUrl = `${API_URL}/storage/${user.image}`;
        console.log("Current image URL:", imageUrl);
        setEditPreviewImage(imageUrl);
      } else {
        setEditPreviewImage(null);
      }
      
      setShowEditModal(true);
    } catch (err) {
      console.error("Error preparing edit:", err);
      alert("Erreur lors du chargement des données utilisateur");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!currentUser) {
      alert("Aucun utilisateur sélectionné");
      return;
    }

    try {
      console.log("Updating user ID:", currentUser.id);
      
      const data = new FormData();
      data.append('name', editFormData.name);
      data.append('email', editFormData.email);
      data.append('role', editFormData.role);
      data.append('address', editFormData.address);
      data.append('_method', 'PUT');
      
      if (editFormData.image) {
        console.log("New image to upload");
        data.append('image', editFormData.image);
      }

      const response = await axios.post(
        `${API_URL}/api/admin/users/${currentUser.id}`, 
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("Update response:", response.data);
      
      alert("Utilisateur modifié avec succès !");
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMessage = "Erreur lors de la modification de l'utilisateur";
      if (err.response?.data?.errors) {
        errorMessage += "\n" + Object.values(err.response.data.errors).flat().join("\n");
      } else if (err.response?.data?.message) {
        errorMessage += ": " + err.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    
    try {
      console.log("Deleting user ID:", id);
      await axios.delete(`${API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUsers(users.filter(u => u.id !== id));
      alert("Utilisateur supprimé avec succès !");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Impossible de supprimer l'utilisateur: " + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "manager",
      address: "",
      image: null
    });
    setPreviewImage(null);
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              Gestion des utilisateurs
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} • Gérez les comptes et les rôles
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="w-full sm:w-auto group flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="hidden sm:inline">Chargement...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Ajouter un utilisateur</span>
                <span className="sm:hidden">Ajouter</span>
              </>
            )}
          </button>
        </div>

        {/* Filtres et recherche responsive */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
              <svg className="absolute left-3 top-3 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base bg-white"
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="manager">Managers</option>
            </select>
          </div>
        </div>

        {/* Table/Cartes responsive */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 sm:p-12 lg:p-16 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-base sm:text-lg mb-2">Aucun utilisateur trouvé</p>
              <p className="text-sm sm:text-base text-gray-400">
                {searchTerm || roleFilter !== 'all' ? 'Essayez de modifier vos filtres' : 'Commencez par ajouter un utilisateur'}
              </p>
            </div>
          ) : (
            <>
              {/* Version Mobile - Cards */}
              <div className="block sm:hidden">
                {filteredUsers.map((user, index) => (
                  <div key={user.id} className={`p-4 border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600 mt-0.5">{user.email}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">ID: {user.id}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                          className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={loading}
                          className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Version Desktop - Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white">
                    <tr>
                      <th className="p-3 lg:p-4 text-left font-semibold text-sm lg:text-base">ID</th>
                      <th className="p-3 lg:p-4 text-left font-semibold text-sm lg:text-base">Nom</th>
                      <th className="p-3 lg:p-4 text-left font-semibold text-sm lg:text-base">Email</th>
                      <th className="p-3 lg:p-4 text-left font-semibold text-sm lg:text-base">Rôle</th>
                      <th className="p-3 lg:p-4 text-left font-semibold text-sm lg:text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user.id} className={`border-b hover:bg-green-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-3 lg:p-4 text-gray-600 text-sm lg:text-base">{user.id}</td>
                        <td className="p-3 lg:p-4 font-medium text-gray-800 text-sm lg:text-base">{user.name}</td>
                        <td className="p-3 lg:p-4 text-gray-600 text-sm lg:text-base break-all">{user.email}</td>
                        <td className="p-3 lg:p-4">
                          <span className={`inline-flex items-center px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium border ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 lg:p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              disabled={loading}
                              className="px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-500 text-white text-xs lg:text-sm rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={loading}
                              className="px-3 lg:px-4 py-1.5 lg:py-2 bg-red-500 text-white text-xs lg:text-sm rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
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
        {filteredUsers.length > 0 && (
          <div className="mt-4 sm:mt-6 flex justify-between items-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredUsers.length}</span> sur <span className="font-medium">{users.length}</span> utilisateurs
            </p>
            <div className="flex gap-2">
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

      {/* Modal Ajout - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Nouvel utilisateur</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Jean Dupont"
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="exemple@email.com"
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="••••••••"
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="manager">Manager</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Adresse complète"
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Image de profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-3 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {previewImage && (
                    <div className="mt-2 sm:mt-3">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-gray-200" 
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-200 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium text-sm sm:text-base transition-all disabled:opacity-50 order-1 sm:order-2"
                >
                  {loading ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modification - Responsive */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate pr-4">
                Modifier {currentUser.name}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="manager">Manager</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditInputChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Image de profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-3 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editPreviewImage && (
                    <div className="mt-2 sm:mt-3">
                      <img 
                        src={editPreviewImage} 
                        alt="Preview" 
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          console.error("Image load error");
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-200 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium text-sm sm:text-base transition-all disabled:opacity-50 order-1 sm:order-2"
                >
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;