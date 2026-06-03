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
  const [images, setImages] = useState([]); // Array of { file, preview }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
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
    setImageError("");
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setImageError("Vous ne pouvez pas ajouter plus de 5 images.");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImageError("");

    if (images.length < 3) {
      setImageError("Veuillez sélectionner au moins 3 images (maximum 5).");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      
      images.forEach((imgObj) => {
        data.append("images[]", imgObj.file);
      });

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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Images du produit (Min 3, Max 5) *
                </label>
                
                {/* Image Previews Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-55">
                        <img
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-750 text-white rounded-full p-1 shadow-md transition duration-150 ease-in-out"
                          title="Supprimer cette image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-[10px] py-1 text-center font-medium">
                          {index === 0 ? "Image principale (Miniature)" : `Image ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Trigger Area */}
                {images.length < 5 && (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition cursor-pointer text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm font-semibold text-gray-700">Sélectionner des images</p>
                    <p className="mt-1 text-xs text-gray-500">Glissez-déposez ou cliquez (Encore {5 - images.length} max)</p>
                  </div>
                )}

                {imageError && (
                  <p className="text-red-500 text-xs mt-2 font-semibold">{imageError}</p>
                )}
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
