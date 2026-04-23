import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (response.data.user.role === "admin") navigate("/admin/dashboard");
        else if (response.data.user.role === "manager") navigate("/manager/dashboard");
        else navigate("/");

        setTimeout(() => window.location.reload(), 100);
      } else {
        setError(response.data.message || "Erreur de connexion");
      }
    } catch (error) {
      if (error.response?.status === 401) setError("Email ou mot de passe incorrect");
      else setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden perspective-1000">
      {/* ARRIÈRE-PLAN 3D ANIMÉ */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
        {/* Effet de profondeur avec cubes flottants */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grands cubes 3D */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-500/5 rounded-3xl transform rotate-45 animate-float-slow border border-green-400/10"
               style={{ transformStyle: 'preserve-3d', transform: 'rotateX(45deg) rotateY(30deg) translateZ(50px)' }}>
          </div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500/5 rounded-3xl transform -rotate-12 animate-float border border-emerald-400/10"
               style={{ transformStyle: 'preserve-3d', transform: 'rotateX(30deg) rotateY(-20deg) translateZ(100px)' }}>
          </div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-green-600/5 rounded-3xl transform rotate-12 animate-float-medium border border-green-400/10"
               style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateY(45deg) translateZ(30px)' }}>
          </div>
          
          {/* Petits cubes */}
          <div className="absolute top-40 right-20 w-32 h-32 bg-emerald-500/10 rounded-2xl transform rotate-45 animate-float-fast border border-emerald-400/20"
               style={{ transformStyle: 'preserve-3d', transform: 'rotateX(45deg) rotateY(45deg) translateZ(70px)' }}>
          </div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-green-500/10 rounded-2xl transform -rotate-12 animate-float-slow border border-green-400/20"
               style={{ transformStyle: 'preserve-3d', transform: 'rotateX(30deg) rotateY(-30deg) translateZ(40px)' }}>
          </div>
          
          {/* Effet de lignes 3D */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 w-1 h-32 bg-gradient-to-b from-green-400/0 via-green-400/30 to-green-400/0"
                 style={{ transform: 'rotateY(45deg) translateZ(20px)' }}></div>
            <div className="absolute top-2/3 right-0 w-1 h-48 bg-gradient-to-b from-emerald-400/0 via-emerald-400/30 to-emerald-400/0"
                 style={{ transform: 'rotateY(-45deg) translateZ(30px)' }}></div>
          </div>

          {/* Grille 3D animée */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              transform: 'perspective(500px) rotateX(60deg) translateZ(-100px)',
              transformOrigin: 'center',
              animation: 'gridMove 20s linear infinite'
            }}
          ></div>

          {/* Particules 3D */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400/30 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `translateZ(${Math.random() * 200}px)`,
                animation: `particleFloat ${5 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* CARD PRINCIPALE - Fixe */}
      <div className="w-full max-w-md relative z-10">
        {/* Ombre décorative */}
        <div className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-xl opacity-30"></div>
        
        {/* Carte principale - Fixe sans transformations 3D */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/30">
          {/* Header avec dégradé vert */}
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center overflow-hidden">
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-white/5"></div>
            
            {/* Motif en arrière-plan */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full filter blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full filter blur-2xl"></div>
            </div>
            
            <div className="relative">
              {/* Icône */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm border border-white/20">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Bienvenue</h1>
              <p className="text-green-50 text-sm">Connectez-vous pour accéder à votre espace</p>
            </div>
          </div>

          <div className="p-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Champ Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors flex items-center"
                  >
                    {showPassword ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                        Masquer
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Afficher
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Lien "Mot de passe oublié" */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-green-600 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </span>
              </button>
            </form>

            {/* Footer simple */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                © Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: rotateX(45deg) rotateY(30deg) translateZ(50px) translateY(0px); }
          50% { transform: rotateX(45deg) rotateY(30deg) translateZ(50px) translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float-slow {
          0%, 100% { transform: rotateX(30deg) rotateY(-20deg) translateZ(100px) translateY(0px); }
          50% { transform: rotateX(30deg) rotateY(-20deg) translateZ(100px) translateY(-15px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        @keyframes float-medium {
          0%, 100% { transform: rotateX(60deg) rotateY(45deg) translateZ(30px) translateY(0px); }
          50% { transform: rotateX(60deg) rotateY(45deg) translateZ(30px) translateY(-25px); }
        }
        .animate-float-medium {
          animation: float-medium 7s ease-in-out infinite;
        }
        
        @keyframes float-fast {
          0%, 100% { transform: rotateX(45deg) rotateY(45deg) translateZ(70px) translateY(0px); }
          50% { transform: rotateX(45deg) rotateY(45deg) translateZ(70px) translateY(-30px); }
        }
        .animate-float-fast {
          animation: float-fast 5s ease-in-out infinite;
        }
        
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateZ(-100px) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateZ(-100px) translateY(50px); }
        }
        
        @keyframes particleFloat {
          0% { transform: translateY(0) translateZ(0) rotate(0deg); }
          100% { transform: translateY(-100vh) translateZ(200px) rotate(360deg); }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Login;