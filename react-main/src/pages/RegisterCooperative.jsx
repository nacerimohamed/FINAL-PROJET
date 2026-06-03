import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

const RegisterCooperative = () => {
  const [searchParams] = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'gratuit';

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tele: "",
    address: "",
    description: "",
    ville: "",
    plan: initialPlan,
    latitude: "",      // ZEDNA HAD CHAMP
    longitude: "",     // ZEDNA HAD CHAMP
  });
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (logo) {
        data.append("logo", logo);
      }

      const response = await axios.post("http://127.0.0.1:8000/api/register-cooperative", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        if (response.data.pending_approval && formData.plan !== 'gratuit') {
          // PAID plan → redirect to payment instructions page
          navigate(`/payment?user_id=${response.data.user.id}&plan=${formData.plan}`);
        } else {
          // FREE plan → auto-approved, go to login
          alert(response.data.message || "Inscription réussie ! Vous pouvez maintenant vous connecter.");
          navigate("/login");
        }
      } else {
        setError(response.data.message || "Erreur d'inscription");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError(error.response?.data?.message || "Erreur serveur lors de l'inscription");
      }
    } finally {
      setLoading(false); // Fix: kant `loading(false)` o rj3naha `setLoading(false)`
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gray-50 relative overflow-hidden">
      {/* Decorative ambient background elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-green-800 to-green-600 rounded-b-[3rem] sm:rounded-b-[5rem] shadow-xl z-0"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 z-0"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 z-0"></div>
      
      {/* BUTTON RETOUR À L'ACCUEIL */}
      <div className="w-full max-w-2xl relative z-10 mt-4 flex justify-start">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold backdrop-blur-md border border-white/20 transition-all duration-200 cursor-pointer shadow-sm group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-gray-100 mt-4 mb-10">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 sm:p-10 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-white/5"></div>
           <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full filter blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full filter blur-2xl"></div>
           </div>

           <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm border border-white/20 text-white shadow-inner">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Inscription Coopérative</h1>
              <p className="text-green-50 text-sm font-medium">Rejoignez notre réseau solidaire et valorisez vos produits du terroir</p>
           </div>
        </div>

        {/* FORM SECTION */}
        <div className="p-8 sm:p-10">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center shadow-sm">
               <svg className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* Grid for compact fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* NOM */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom de la coopérative *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ex: Coopérative Amal"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse email *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="contact@coop.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>

              {/* MOT DE PASSE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>

              {/* TÉLÉPHONE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="tele"
                    placeholder="06 00 00 00 00"
                    value={formData.tele}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>

            </div>

            {/* VILLE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ville (Région Drâa-Tafilalet) *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
                  name="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 shadow-sm appearance-none"
                >
                  <option value="" disabled>Sélectionnez une ville</option>
                  <option value="Errachidia">Errachidia</option>
                  <option value="Ouarzazate">Ouarzazate</option>
                  <option value="Zagora">Zagora</option>
                  <option value="Tinghir">Tinghir</option>
                  <option value="Midelt">Midelt</option>
                </select>
                {/* Custom arrow for select */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* ADRESSE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse physique</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Quartier, Région"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* GOOGLE MAPS (LATITUDE & LONGITUDE) */}
            <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/80 space-y-4">
              <span className="text-xs font-bold text-green-800 uppercase tracking-wider block mb-1">Localisation Google Maps</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    placeholder="Ex: 31.5134"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    placeholder="Ex: -5.5321"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm shadow-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">Vous pouvez copier ces valeurs depuis l'URL de votre position sur Google Maps.</p>
            </div>

            {/* LOGO */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Logo de la coopérative</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLineround="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-semibold text-green-600 hover:text-green-500 focus-within:outline-none">
                      <span>Télécharger un fichier</span>
                      <input id="logo-upload" name="logo" type="file" accept="image/*" className="sr-only" onChange={handleLogoChange} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 2MB</p>
                  {logo && <p className="text-sm text-green-600 font-medium mt-2">Fichier sélectionné: {logo.name}</p>}
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description (optionnelle)</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Décrivez brièvement l'activité de votre coopérative..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 shadow-sm resize-none"
              ></textarea>
            </div>

            {/* BOUTON */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </>
                ) : (
                  "Créer mon compte coopérative"
                )}
              </button>
            </div>
          </form>

          {/* LIEN DE CONNEXION */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-green-600 font-bold hover:text-green-700 hover:underline transition-colors">
                Connectez-vous ici
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCooperative;