import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PaymentInstructions = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user_id');
  const plan = searchParams.get('plan');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    transaction_id: "",
  });
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Rediriger si on accède à cette page sans user_id ou plan
  if (!userId || !plan) {
    navigate("/");
    return null;
  }

  const prices = {
    standard: "500 DH",
    premium: "1200 DH",
    professionnel: "2000 DH"
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append('user_id', userId);
      submitData.append('plan', plan);
      submitData.append('name', formData.name);
      submitData.append('phone', formData.phone);
      submitData.append('transaction_id', formData.transaction_id);
      if (screenshot) {
        submitData.append('screenshot', screenshot);
      }

      const response = await axios.post("http://127.0.0.1:8000/api/payments", submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || "Erreur lors de la soumission du paiement.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Paiement Soumis avec Succès !</h2>
            <p className="text-gray-600 mb-8">
              Merci pour votre paiement. Notre équipe va vérifier votre transaction dans les plus brefs délais (généralement sous 24h). 
              Dès validation, votre compte sera activé et vous serez notifié par WhatsApp ou Email.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
            >
              Aller à la page de connexion
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructions de Paiement</h1>
            <p className="text-gray-600">Abonnement à l'offre <span className="font-bold text-green-600 uppercase">{plan}</span> - Montant à régler : <span className="font-bold text-xl">{prices[plan]}</span></p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Colonne gauche : Instructions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Méthodes de paiement acceptées</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2"> Virement Bancaire (CIH)</h3>
                  <p className="text-sm text-blue-800 mb-1">Nom: <span className="font-semibold">Coop Platform</span></p>
                  <p className="text-sm text-blue-800 font-mono">RIB: 230 000 0000000000000000 00</p>
                </div>


                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <h3 className="font-bold text-yellow-900 mb-2"> Wafacash / Cash Plus</h3>
                  <p className="text-sm text-yellow-800 mb-1">Nom complet: <span className="font-semibold">Mohamed ELMA</span></p>
                  <p className="text-sm text-yellow-800 mb-1">CIN: <span className="font-semibold">AB123456</span></p>
                  <p className="text-sm text-yellow-800">Tél: <span className="font-semibold">06 00 00 00 00</span></p>
                </div>

                <div className="mt-8 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold mb-1">Comment procéder ?</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Effectuez le paiement via l'une des méthodes ci-dessus.</li>
                    <li>Gardez le reçu ou prenez une capture d'écran de la transaction.</li>
                    <li>Remplissez le formulaire ci-contre avec les détails de votre paiement.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Colonne droite : Formulaire */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Confirmer votre paiement</h2>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet (celui de l'expéditeur)</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: Ahmed Benjelloun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ex: 0612345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code de transaction (ID) / Référence</label>
                  <input
                    type="text"
                    name="transaction_id"
                    required
                    value={formData.transaction_id}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-green-500 focus:border-green-500 font-mono"
                    placeholder="Ex: TXN-987654321"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reçu de paiement / Capture d'écran (Optionnel)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format accepté : JPG, PNG. Max 2MB.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 mt-4 transition-colors"
                >
                  {loading ? "Soumission en cours..." : "Soumettre le paiement"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentInstructions;
