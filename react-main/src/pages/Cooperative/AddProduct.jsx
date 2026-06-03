import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Plan product limits (must match backend)
const PLAN_LIMITS = {
  gratuit: 1,
  standard: 5,
  premium: 15,
  professionnel: Infinity
};

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [limitInfo, setLimitInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLimit = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userPlan = user.plan || "gratuit";
        const planLimit = PLAN_LIMITS[userPlan] || PLAN_LIMITS.gratuit;

        if (planLimit !== Infinity) {
          const response = await axios.get("http://127.0.0.1:8000/api/cooperative/products", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            const productCount = response.data.data.length;
            setLimitInfo({ plan: userPlan, count: productCount, limit: planLimit });
            if (productCount >= planLimit) {
              setIsLimitReached(true);
              setError(`Limite atteinte (${planLimit} produits max pour le plan ${userPlan}). Veuillez passer à une offre supérieure.`);
            }
          }
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la limite", err);
      }
    };
    checkLimit();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      await axios.post("http://127.0.0.1:8000/api/cooperative/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/cooperative/products");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de l'ajout du produit.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/cooperative/products" className="text-gray-500 hover:text-gray-700 font-medium">
            &larr; Retour aux produits
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un produit</h1>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700">
              {error}
            </div>
          )}

          {isLimitReached ? (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-6">Vous ne pouvez plus ajouter de produits avec votre plan actuel.</p>
              <Link
                to="/cooperative/products"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Retour aux produits
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du produit</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (DH)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock (quantité)</label>
                <input
                  type="number"
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 border p-3 focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image du produit</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Link
                to="/cooperative/products"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-4"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-6 inline-flex justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Enregistrement..." : "Ajouter le produit"}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
