<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class PublicProductController extends Controller
{
    /**
     * Get all products (public access)
     */
    public function index()
    {
        try {
            $products = Product::with(['cooperative' => function($query) {
                $query->select('id', 'nom', 'email', 'tele', 'whatsapp');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'image' => $product->image,
                    'price' => $product->price,
                    'quantity' => $product->quantity,
                    'cooperative' => [
                        'id' => $product->cooperative->id ?? null,
                        'name' => $product->cooperative->nom ?? 'Unknown',
                        'email' => $product->cooperative->email ?? null,
                        'phone' => $product->cooperative->tele ?? $product->cooperative->whatsapp ?? null,
                        'whatsapp' => $product->cooperative->whatsapp ?? $product->cooperative->tele ?? null,
                    ],
                    'created_at' => $product->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single product details
     */
    public function show($id)
    {
        try {
            $product = Product::with(['cooperative' => function($query) {
                $query->select('id', 'nom', 'email', 'tele', 'whatsapp', 'description', 'image');
            }])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'image' => $product->image,
                    'price' => $product->price,
                    'quantity' => $product->quantity,
                    'cooperative' => [
                        'id' => $product->cooperative->id ?? null,
                        'name' => $product->cooperative->nom ?? 'Unknown',
                        'email' => $product->cooperative->email ?? null,
                        'description' => $product->cooperative->description ?? null,
                        'image' => $product->cooperative->image ?? null,
                        'phone' => $product->cooperative->tele ?? $product->cooperative->whatsapp ?? null,
                        'whatsapp' => $product->cooperative->whatsapp ?? $product->cooperative->tele ?? null,
                    ],
                    'created_at' => $product->created_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get featured products (latest 6)
     */
    public function featured()
    {
        try {
            $products = Product::with(['cooperative' => function($query) {
                $query->select('id', 'nom', 'email', 'tele', 'whatsapp');
            }])
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'image' => $product->image,
                    'price' => $product->price,
                    'quantity' => $product->quantity,
                    'cooperative' => [
                        'id' => $product->cooperative->id ?? null,
                        'name' => $product->cooperative->nom ?? 'Unknown',
                        'whatsapp' => $product->cooperative->whatsapp ?? $product->cooperative->tele ?? null,
                    ],
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching featured products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
