import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagerSidebar from './ManagerSidebar';

const ManagerProducts = () => {
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCooperatives();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/manager/products', {
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
      const response = await axios.get('http://localhost:8000/api/manager/cooperatives', {
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
        ? `http://localhost:8000/api/manager/products/${currentProduct.id}`
        : 'http://localhost:8000/api/manager/products';
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', currentProduct.name);
      formData.append('cooperative_id', currentProduct.cooperative_id);
      formData.append('price', currentProduct.price);
      formData.append('quantity', currentProduct.quantity);
      if (currentProduct.description) {
        formData.append('description', currentProduct.description);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (editMode) {
        formData.append('_method', 'PUT');
      }
      
      const response = await axios.post(url, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert(editMode ? 'Product updated successfully!' : 'Product created successfully!');
        fetchProducts();
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Error saving product: ' + (error.response?.data?.message || error.message));
      }
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
    setImageFile(null);
    setImagePreview(product.image || null);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8000/api/manager/products/${id}`, {
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
    setImageFile(null);
    setImagePreview(null);
    setEditMode(false);
    setErrors({});
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <ManagerSidebar />
      
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Product Management</h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Manage all products from all cooperatives</p>
            </div>
            <button
              onClick={handleAddNew}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 md:py-3 md:px-6 rounded-lg transition shadow-md text-sm md:text-base"
            >
              + Add New Product
            </button>
          </div>

          {/* Products Table - Card View on Mobile, Table on Desktop */}
          {loading ? (
            <div className="text-center py-8 md:py-12">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-sm md:text-base text-gray-600 mt-3 md:mt-4">Loading products...</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-4">
                {products.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
                    <p className="text-gray-500">No products found. Add your first product!</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={product.image || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-800 text-base md:text-lg">{product.name}</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">{product.description?.substring(0, 50)}...</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.quantity > 10 
                                  ? 'bg-green-100 text-green-800' 
                                  : product.quantity > 0 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                Stock: {product.quantity}
                              </span>
                            </div>
                            <div className="mt-2 space-y-1">
                              <p className="text-xs md:text-sm text-gray-600">
                                <span className="font-medium">Cooperative:</span> {product.cooperative?.nom || 'N/A'}
                              </p>
                              <p className="text-sm md:text-base font-semibold text-green-600">
                                {product.price} DH
                              </p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleEdit(product)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Image</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Product Name</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Cooperative</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Price (DH)</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Stock</th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-center text-sm md:text-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 md:px-6 py-6 md:py-8 text-center text-gray-500">
                            No products found. Add your first product!
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition">
                            <td className="px-4 md:px-6 py-3 md:py-4">
                              <img
                                src={product.image || 'https://via.placeholder.com/100'}
                                alt={product.name}
                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                              />
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                              <div className="font-semibold text-gray-800 text-sm md:text-base">{product.name}</div>
                              <div className="text-xs md:text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-gray-700">
                              {product.cooperative?.nom || 'N/A'}
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-green-600 text-sm md:text-base">
                              {product.price}
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                              <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${
                                product.quantity > 10 
                                  ? 'bg-green-100 text-green-800' 
                                  : product.quantity > 0 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.quantity}
                              </span>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-xs md:text-sm transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-xs md:text-sm transition"
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
            </>
          )}
        </div>
      </div>

      {/* Modal - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
                {editMode ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                {/* Cooperative Selection */}
                <div>
                  <label className="block text-sm md:text-base text-gray-700 font-semibold mb-1 md:mb-2">
                    Cooperative *
                  </label>
                  <select
                    name="cooperative_id"
                    value={currentProduct.cooperative_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
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
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.cooperative_id}</p>
                  )}
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm md:text-base text-gray-700 font-semibold mb-1 md:mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 md:px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm md:text-base text-gray-700 font-semibold mb-1 md:mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={currentProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Price and Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm md:text-base text-gray-700 font-semibold mb-1 md:mb-2">
                      Price (DH) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={currentProduct.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 md:px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs md:text-sm mt-1">{errors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm md:text-base text-gray-700 font-semibold mb-1 md:mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={currentProduct.quantity}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-3 md:px-4 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-xs md:text-sm mt-1">{errors.quantity}</p>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm md:text-base text-gray-700 font-semibold mb-1 md:mb-2">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-3 md:file:mr-4 file:py-1.5 md:file:py-2 file:px-3 md:file:px-4 file:rounded-lg file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {imagePreview && (
                    <div className="mt-2 md:mt-3">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 md:mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="w-full sm:w-auto px-4 md:px-6 py-2 text-sm md:text-base border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 md:px-6 py-2 text-sm md:text-base bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
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

export default ManagerProducts;