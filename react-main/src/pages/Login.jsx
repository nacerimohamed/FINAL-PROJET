import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("handleLogin started with:", { email, password });
    setError("");
    setLoading(true);

    try {
      console.log("Sending request to backend...");
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      console.log("Response received:", response.data);

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // الإبقاء على اللوجيك المطور للأدوار كاملين
        if (response.data.user.role === "admin") navigate("/admin/dashboard");
        else if (response.data.user.role === "manager") navigate("/manager/dashboard");
        else if (response.data.user.role === "cooperative") navigate("/cooperative/dashboard");
        else navigate("/");

        setTimeout(() => window.location.reload(), 100);
      } else {
        setError(response.data.message || "Erreur de connexion");
      }
    } catch (error) {
      if (error.response?.status === 401) setError("Email ou mot de passe incorrect");
      else if (error.response?.status === 403) setError(error.response.data.message || "Votre compte est en attente d'approbation par l'administrateur.");
      else setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/forgot-password", { email: forgotEmail });
      if (res.data.success) {
        setForgotSuccess(res.data.message);
        setForgotStep(2);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || "Erreur lors de l'envoi de l'email.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/reset-password", {
        email: forgotEmail,
        otp: otp.trim(),
        password: newPassword
      });
      if (res.data.success) {
        setForgotSuccess(res.data.message);
        setTimeout(() => {
          closeForgotModal();
        }, 3000);
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || "Code invalide ou erreur.");
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setForgotError("");
    setForgotSuccess("");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50 overflow-hidden relative">
      {/* CARD PRINCIPALE */}
      <div className="w-full max-w-4xl h-auto max-h-[85vh] bg-[#f4faf7] rounded-[2rem] shadow-2xl flex overflow-hidden border border-green-100/60 relative z-10">

        {/* COLONNE GAUCHE: FORMULAIRE (Rddit-ha bg-[#f4faf7] o l-wst items-center) */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center items-center h-full overflow-y-auto scrollbar-none bg-[#f4faf7]">
          <div className="max-w-sm w-full mx-auto my-auto">

            <div className="text-center lg:text-left mb-6 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-2xl mb-3 text-green-600 shadow-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Bienvenue</h1>
              <p className="text-gray-500 text-xs">Connectez-vous pour accéder à votre espace</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 focus:border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 shadow-sm text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Mot de passe
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 focus:border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200 shadow-sm text-sm"
                  />
                  
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-700 text-xs font-medium">{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-orange-500 text-white font-semibold text-sm rounded-full hover:bg-orange-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs text-gray-600">
                Vous n'avez pas de compte ?{" "}
                <Link to="/register-cooperative" className="text-gray-900 font-bold hover:underline transition-colors">
                  S'inscrire
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE: IMAGE DÉCORATIVE */}
        <div className="hidden lg:block lg:w-1/2 p-2.5">
          <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative group">
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-green-800/40 to-yellow-500/30 z-10 mix-blend-multiply"></div>

            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
              alt="Coopérative agricole marocaine"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Texte superposé */}
            <div className="absolute bottom-8 left-6 right-6 z-20 text-white">
              <span className="inline-block px-2 py-0.5 bg-yellow-500/90 text-yellow-50 text-[10px] font-bold uppercase tracking-wider rounded-full mb-1.5 backdrop-blur-sm">
                Réseau Solidaire
              </span>
              <h2 className="text-xl font-bold mb-1.5 leading-tight text-white drop-shadow-md">
                Valorisons le travail <br /> des coopératives marocaines.
              </h2>
              <p className="text-green-50 text-[11px] opacity-90 drop-shadow max-w-sm">
                Découvrez et partagez l'excellence des produits du terroir, issus d'une agriculture durable et d'un savoir-faire authentique.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: MOT DE PASSE OUBLIÉ */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button
              onClick={closeForgotModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Réinitialisation</h3>
                <p className="text-gray-500 text-xs mt-1">
                  {forgotStep === 1
                    ? "Entrez votre email pour recevoir un code de sécurité."
                    : "Entrez le code reçu par email et votre nouveau mot de passe."}
                </p>
              </div>

              {forgotError && (
                <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs mb-3 text-center font-medium">
                  {forgotError}
                </div>
              )}
              {forgotSuccess && (
                <div className="bg-green-50 text-green-700 p-2 rounded-lg text-xs mb-3 text-center font-medium">
                  {forgotSuccess}
                </div>
              )}

              {/* STEP 1: SEND EMAIL */}
              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Votre adresse email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50 text-sm cursor-pointer"
                  >
                    {forgotLoading ? "Envoi en cours..." : "Envoyer le code"}
                  </button>
                </form>
              )}

              {/* STEP 2: VERIFY OTP & NEW PASSWORD */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="Code à 6 chiffres"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\s/g, ''))}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-center tracking-widest font-bold text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      required
                      placeholder="Nouveau mot de passe"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition disabled:opacity-50 text-sm cursor-pointer"
                  >
                    {forgotLoading ? "Vérification..." : "Réinitialiser le mot de passe"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;