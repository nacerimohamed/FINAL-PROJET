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

// ProtectedRoute
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("🔒 ProtectedRoute check:", { token, user, requiredRole: role });

  if (!token || !user) {
    console.log("❌ Non authentifié, redirection vers /login");
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    console.log(`❌ Rôle incorrect: ${user.role} au lieu de ${role}`);
    return <Navigate to="/" replace />;
  }
  
  console.log("✅ Accès autorisé pour:", user.role);
  return children;
};

function App() {
  return (
    <Router>
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