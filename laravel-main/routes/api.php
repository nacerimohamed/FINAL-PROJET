<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Manager\ManagerDashboardController;
use App\Http\Controllers\Api\Admin\UserManagementController;
use App\Http\Controllers\Api\Admin\CooperativeController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Manager\ProductController;
use App\Http\Controllers\Api\PublicProductController;
use App\Http\Controllers\Api\PublicCooperativeController;



use App\Http\Controllers\ContactController;

// Route publique pour le formulaire de contact
Route::post('/contact', [ContactController::class, 'store']);

// Routes protégées pour l'admin
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/contacts/recent', [ContactController::class, 'getRecentMessages']);
    Route::put('/admin/contacts/{id}/mark-as-read', [ContactController::class, 'markAsRead']);
});





// ===== PUBLIC ROUTES =====
// Products (public access)
Route::get('/products', [PublicProductController::class, 'index']);
Route::get('/products/featured', [PublicProductController::class, 'featured']);
Route::get('/products/{id}', [PublicProductController::class, 'show']);

// Cooperatives (public access)
Route::get('/cooperatives', [PublicCooperativeController::class, 'index']);
Route::get('/cooperatives/featured', [PublicCooperativeController::class, 'featured']);
Route::get('/cooperatives/{id}', [PublicCooperativeController::class, 'show']);
Route::get('/cooperatives/{id}/products', [PublicCooperativeController::class, 'products']);

// ===== PUBLIC AUTH ROUTES =====
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// ===== PROTECTED ROUTES =====
Route::middleware('auth:sanctum')->group(function () {

    // Current user routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // ===== ADMIN ROUTES =====
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Users CRUD routes
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::post('/users', [UserManagementController::class, 'store']);
        Route::put('/users/{id}', [UserManagementController::class, 'update']);
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);

        // Cooperatives CRUD routes
        // Supports ?region=Tinghir (or any province) for the interactive map
        Route::get('/cooperatives', [CooperativeController::class, 'index']);
        Route::post('/cooperatives', [CooperativeController::class, 'store']);
        Route::get('/cooperatives/{id}', [CooperativeController::class, 'show']);
        Route::put('/cooperatives/{id}', [CooperativeController::class, 'update']);
        Route::delete('/cooperatives/{id}', [CooperativeController::class, 'destroy']);

        // Products CRUD routes (admin view)
        Route::get('/products', [AdminProductController::class, 'index']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::get('/products/{id}', [AdminProductController::class, 'show']);
        Route::put('/products/{id}', [AdminProductController::class, 'update']);
        Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);
    });

    // ===== MANAGER ROUTES =====
    Route::middleware('role:manager')->prefix('manager')->group(function () {
        Route::get('/dashboard', [ManagerDashboardController::class, 'index']);

        // Cooperatives list (for dropdown in product form)
        Route::get('/cooperatives', [CooperativeController::class, 'index']);

        // Products CRUD routes - MANAGER ONLY MANAGES PRODUCTS
        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::get('/products/{id}', [ProductController::class, 'show']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    });
});