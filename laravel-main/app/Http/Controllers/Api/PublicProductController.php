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
            $products = Product::whereHas('cooperative', function($q) {
                $q->where('is_approved', true);
            })
            ->with(['cooperative' => function($query) {
                $query->select('id', 'nom', 'email', 'tele');
            }, 'images'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'category' => $product->category,
                    'image' => $product->image,
                    'price' => $product->price,
                    'quantity' => $product->quantity,
                    'cooperative' => [
                        'id' => $product->cooperative->id ?? null,
                        'name' => $product->cooperative->nom ?? 'Inconnue',
                        'email' => $product->cooperative->email ?? null,
                        'phone' => $product->cooperative->tele ?? null,
                        'whatsapp' => $product->cooperative->tele ?? null,
                    ],
                    'images' => $product->images->map(function($img) {
                        return [
                            'id' => $img->id,
                            'url' => $img->url
                        ];
                    }),
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
            $product = Product::whereHas('cooperative', function($q) {
                $q->where('is_approved', true);
            })->with(['cooperative' => function($query) {
                $query->select('id', 'nom', 'email', 'tele', 'description', 'image');
            }, 'images'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'category' => $product->category,
                    'image' => $product->image,
                    'price' => $product->price,
                    'quantity' => $product->quantity,
                    'cooperative' => [
                        'id' => $product->cooperative->id ?? null,
                        'name' => $product->cooperative->nom ?? 'Inconnue',
                        'email' => $product->cooperative->email ?? null,
                        'description' => $product->cooperative->description ?? null,
                        'image' => $product->cooperative->image ?? null,
                        'phone' => $product->cooperative->tele ?? null,
                        'whatsapp' => $product->cooperative->tele ?? null,
                    ],
                    'images' => $product->images->map(function($img) {
                        return [
                            'id' => $img->id,
                            'url' => $img->url
                        ];
                    }),
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
            $products = Product::whereHas('cooperative', function($q) {
                $q->where('is_approved', true);
            })
            ->with(['cooperative' => function($query) {
                $query->select('id', 'nom', 'email', 'tele');
            }, 'images'])
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'category' => $product->category,
                    'image' => $product->image,
                    'price' => $product->price,
                    'quantity' => $product->quantity,
                    'cooperative' => [
                        'id' => $product->cooperative->id ?? null,
                        'name' => $product->cooperative->nom ?? 'Inconnue',
                        'whatsapp' => $product->cooperative->tele ?? null,
                    ],
                    'images' => $product->images->map(function($img) {
                        return [
                            'id' => $img->id,
                            'url' => $img->url
                        ];
                    }),
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
