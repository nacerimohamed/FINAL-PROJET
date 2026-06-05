import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, phone) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir marquer ce paiement comme ${status === 'accepted' ? 'Accepté' : 'Refusé'} ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8000/api/admin/payments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        alert(response.data.message);
        fetchPayments();
        if (status === 'accepted' && phone) {
          const message = encodeURIComponent("Félicitations ! Votre paiement a été validé et votre compte coopérative est maintenant actif sur notre plateforme.");
          const cleanPhone = phone.replace(/\D/g, '');
          window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
        }
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Validation des Paiements</h1>
            <p className="text-gray-600 mt-2">Gérez les reçus de paiement et activez les comptes des coopératives.</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Chargement des paiements...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
              <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Utilisateur</th>
                      <th className="px-6 py-4 text-left">Détails Expéditeur</th>
                      <th className="px-6 py-4 text-left">Plan</th>
                      <th className="px-6 py-4 text-left">ID Transaction</th>
                      <th className="px-6 py-4 text-left">Reçu</th>
                      <th className="px-6 py-4 text-left">Statut</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                          Aucun paiement trouvé.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-800">{payment.user?.name}</div>
                            <div className="text-xs text-gray-500">{payment.user?.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{payment.name}</div>
                            <div className="text-sm text-gray-500">{payment.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase">
                              {payment.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">
                            {payment.transaction_id}
                          </td>
                          <td className="px-6 py-4">
                            {payment.screenshot_path ? (
                              <a 
                                href={`http://localhost:8000${payment.screenshot_path}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm flex items-center gap-1"
                              >
                                Voir le reçu
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">Aucun reçu</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              payment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              payment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status === 'pending' ? 'En attente' : 
                               payment.status === 'accepted' ? 'Accepté' : 'Refusé'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {payment.status === 'pending' ? (
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleUpdateStatus(payment.id, 'accepted', payment.phone)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                                >
                                  Accepter
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(payment.id, 'rejected', null)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                                >
                                  Refuser
                                </button>
                              </div>
                            ) : (
                              <div className="text-center text-gray-400 text-sm">
                                Traité
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
