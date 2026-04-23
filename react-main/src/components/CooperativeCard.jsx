import React from "react";
import { Link } from "react-router-dom";

const CooperativeCard = ({ cooperative }) => {
  const getCooperativeImage = () => {
    return cooperative.image || "https://via.placeholder.com/400x250/059669/ffffff?text=Coopérative";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={getCooperativeImage()}
          alt={cooperative.nom}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x250/059669/ffffff?text=Coopérative";
          }}
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {cooperative.nom}
        </h3>
        
        {cooperative.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {cooperative.description}
          </p>
        )}

        <div className="flex-grow">
          {cooperative.adresse && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-1">📍 Adresse:</p>
              <p className="text-gray-700 text-sm">{cooperative.adresse}</p>
            </div>
          )}

          {cooperative.tele && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">📞 Téléphone:</p>
              <p className="text-gray-700 text-sm">{cooperative.tele}</p>
            </div>
          )}

          {/* Social Media Links */}
          {(cooperative.instagram || cooperative.facebook || cooperative.whatsapp) && (
            <div className="flex gap-3 mb-4 pt-3 border-t">
              {cooperative.instagram && (
                <a
                  href={cooperative.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700 transition text-sm"
                >
                  📷
                </a>
              )}
              {cooperative.facebook && (
                <a
                  href={cooperative.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition text-sm"
                >
                  📘
                </a>
              )}
              {cooperative.whatsapp && (
                <a
                  href={`https://wa.me/${cooperative.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 transition text-sm"
                >
                  💬
                </a>
              )}
            </div>
          )}
        </div>
        
        <Link
          to={`/cooperatives/${cooperative.id}`}
          className="block w-full text-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-semibold mt-4"
        >
          Voir les produits
        </Link>
      </div>
    </div>
  );
};

export default CooperativeCard;
