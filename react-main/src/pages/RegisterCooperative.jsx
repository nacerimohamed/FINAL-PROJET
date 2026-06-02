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
    plan: initialPlan,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register-cooperative", formData);

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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Inscription Coopérative</h1>
          <p className="text-gray-500 mt-2">Créez votre compte pour gérer vos produits</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de la coopérative</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="text"
              name="tele"
              value={formData.tele}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (optionnel)</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Déjà un compte ? <Link to="/login" className="text-green-600 hover:text-green-500 font-medium">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterCooperative;
