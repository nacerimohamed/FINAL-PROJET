import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cooperatives from "./pages/Cooperatives";
import CooperativeDetail from "./pages/CooperativeDetail";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import ManagerProducts from "./pages/Manager/ManagerProducts";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminCooperatives from "./pages/Admin/AdminCooperatives";

import ScrollToTop from "./components/ScrollToTop";

// ProtectedRoute
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  let user = null;
  
  try {
    const userData = localStorage.getItem("user");
    if (userData) user = JSON.parse(userData);
  } catch (e) {
    console.error("Erreur parsing user:", e);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cooperatives" element={<Cooperatives />} />
        <Route path="/cooperatives/:id" element={<CooperativeDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cooperatives"
          element={
            <ProtectedRoute role="admin">
              <AdminCooperatives />
            </ProtectedRoute>
          }
        />
        
        {/* Manager Routes */}
        <Route
          path="/manager/home"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/products"
          element={
            <ProtectedRoute role="manager">
              <ManagerProducts/>
            </ProtectedRoute>
          }
        />
        
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;