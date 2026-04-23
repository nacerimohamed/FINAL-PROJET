import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    quantity: '',
    cooperative_id: '',
    image: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCooperatives();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCooperatives = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/cooperatives', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCooperatives(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cooperatives:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!currentProduct.name.trim()) newErrors.name = 'Product name is required';
    if (!currentProduct.price || parseFloat(currentProduct.price) <= 0) newErrors.price = 'Valid price is required';
    if (!currentProduct.quantity || parseInt(currentProduct.quantity) < 0) newErrors.quantity = 'Valid quantity is required';
    if (!currentProduct.cooperative_id) newErrors.cooperative_id = 'Cooperative is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      const url = editMode 
        ? `http://localhost:8000/api/admin/products/${currentProduct.id}`
        : 'http://localhost:8000/api/admin/products';
      
      const method = editMode ? 'put' : 'post';
      
      const response = await axios[method](url, currentProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert(editMode ? 'Product updated successfully!' : 'Product created successfully!');
        fetchProducts();
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      cooperative_id: product.cooperative_id,
      image: product.image || ''
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Product deleted successfully!');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      id: null,
      name: '',
      description: '',
      price: '',
      quantity: '',
      cooperative_id: '',
      image: ''
    });
    setEditMode(false);
    setErrors({});
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
              <p className="text-gray-600 mt-2">Manage all products from all cooperatives</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md"
            >
              + Add New Product
            </button>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Image</th>
                      <th className="px-6 py-4 text-left">Product Name</th>
                      <th className="px-6 py-4 text-left">Cooperative</th>
                      <th className="px-6 py-4 text-left">Price (DH)</th>
                      <th className="px-6 py-4 text-left">Stock</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No products found. Add your first product!
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <img 
                              src={product.image || 'https://via.placeholder.com/50'} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-800">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {product.cooperative?.nom || 'N/A'}
                          </td>
                          <td className="px-6 py-4 font-semibold text-green-600">
                            {product.price}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              product.quantity > 10 
                                ? 'bg-green-100 text-green-800' 
                                : product.quantity > 0 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                              >
                                Delete
                              </button>
                            </div>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Cooperative Selection */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Cooperative *
                  </label>
                  <select
                    name="cooperative_id"
                    value={currentProduct.cooperative_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.cooperative_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a cooperative</option>
                    {cooperatives.map(coop => (
                      <option key={coop.id} value={coop.id}>
                        {coop.nom}
                      </option>
                    ))}
                  </select>
                  {errors.cooperative_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.cooperative_id}</p>
                  )}
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={currentProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Price and Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Price (DH) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={currentProduct.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={currentProduct.quantity}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                    )}
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={currentProduct.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {currentProduct.image && (
                    <img 
                      src={currentProduct.image} 
                      alt="Preview" 
                      className="mt-2 w-32 h-32 object-cover rounded"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    {editMode ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
