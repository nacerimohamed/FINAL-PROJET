<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;

class PublicCooperativeController extends Controller
{
    /**
     * Get all cooperatives (public access)
     */
    public function index()
    {
        try {
            $cooperatives = User::where('role', 'cooperative')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($coop) {
                    return [
                        'id' => $coop->id,
                        'nom' => $coop->name,
                        'email' => $coop->email,
                        'ville' => $coop->ville,
                        'description' => $coop->description,
                        'adresse' => $coop->adresse,
                        'image' => $coop->image ?? null,
                        'contact' => $coop->tele,
                        'tele' => $coop->tele,
                        'instagram' => null,
                        'facebook' => null,
                        'whatsapp' => $coop->tele,
                        'created_at' => $coop->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $cooperatives
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching cooperatives',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single cooperative details
     */
    public function show($id)
    {
        try {
            $cooperative = User::where('role', 'cooperative')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $cooperative->id,
                    'nom' => $cooperative->name,
                    'email' => $cooperative->email,
                    'ville' => $cooperative->ville,
                    'description' => $cooperative->description,
                    'adresse' => $cooperative->adresse,
                    'image' => $cooperative->image ?? null,
                    'contact' => $cooperative->tele,
                    'tele' => $cooperative->tele,
                    'instagram' => null,
                    'facebook' => null,
                    'whatsapp' => $cooperative->tele,
                    'created_at' => $cooperative->created_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cooperative not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get featured cooperatives (latest 4)
     */
    public function featured()
    {
        try {
            $cooperatives = User::where('role', 'cooperative')
                ->orderBy('created_at', 'desc')
                ->limit(4)
                ->get()
                ->map(function($coop) {
                    return [
                        'id' => $coop->id,
                        'nom' => $coop->name,
                        'description' => $coop->description,
                        'image' => $coop->image ?? null,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $cooperatives
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching featured cooperatives',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products by cooperative
     */
    public function products($id)
    {
        try {
            // First verify cooperative exists
            $cooperative = User::where('role', 'cooperative')->findOrFail($id);
            
            // Get products for this cooperative
            $products = Product::where('cooperative_id', $id)
                ->with(['cooperative' => function($query) {
                    $query->select('id', 'name', 'email');
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
                            'nom' => $product->cooperative->name ?? 'Unknown',
                        ],
                        'created_at' => $product->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $products,
                'cooperative' => [
                    'id' => $cooperative->id,
                    'nom' => $cooperative->name,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching cooperative products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
