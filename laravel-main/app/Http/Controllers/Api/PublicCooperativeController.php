<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Cooperative;
use Illuminate\Http\Request;

class PublicCooperativeController extends Controller
{
    /**
     * Get all cooperatives (public access - ONLY APPROVED)
     */
    public function index()
    {
        try {
            $cooperatives = Cooperative::where('is_approved', true)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($coop) {
                    return [
                        'id' => $coop->id,
                        'nom' => $coop->nom,
                        'email' => $coop->email,
                        'ville' => $coop->ville,
                        'description' => $coop->description,
                        'adresse' => $coop->adresse,
                        'image' => $coop->image ?? null,
                        'contact' => $coop->contact,
                        'tele' => $coop->tele,
                        'instagram' => $coop->instagram,
                        'facebook' => $coop->facebook,
                        'whatsapp' => $coop->whatsapp,
                        'latitude' => $coop->latitude,
                        'longitude' => $coop->longitude,
                        'google_maps_link' => $coop->google_maps_link,
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
     * Get single cooperative details (ONLY IF APPROVED)
     */
    public function show($id)
    {
        try {
            // Récupérer la coopérative uniquement si elle est approuvée
            $cooperative = Cooperative::where('is_approved', true)->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $cooperative->id,
                    'nom' => $cooperative->nom,
                    'email' => $cooperative->email,
                    'ville' => $cooperative->ville,
                    'description' => $cooperative->description,
                    'adresse' => $cooperative->adresse,
                    'image' => $cooperative->image ?? null,
                    'contact' => $cooperative->contact,
                    'tele' => $cooperative->tele,
                    'instagram' => $cooperative->instagram,
                    'facebook' => $cooperative->facebook,
                    'whatsapp' => $cooperative->whatsapp,
                    'latitude' => $cooperative->latitude,
                    'longitude' => $cooperative->longitude,
                    'google_maps_link' => $cooperative->google_maps_link,
                    'created_at' => $cooperative->created_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cooperative not found or not approved yet',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get featured cooperatives (latest 4 - ONLY APPROVED)
     */
    public function featured()
    {
        try {
            // Récupérer les coopératives récentes approuvées
            $cooperatives = Cooperative::where('is_approved', true)
                ->orderBy('created_at', 'desc')
                ->limit(4)
                ->get()
                ->map(function($coop) {
                    return [
                        'id' => $coop->id,
                        'nom' => $coop->nom,
                        'description' => $coop->description,
                        'image' => $coop->image ?? null,
                        'latitude' => $coop->latitude,
                        'longitude' => $coop->longitude,
                        'google_maps_link' => $coop->google_maps_link,
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
            // Vérifier que la coopérative existe et est approuvée
            $cooperative = Cooperative::where('is_approved', true)->findOrFail($id);
            
            // Get products for this cooperative
            $products = Product::where('cooperative_id', $id)
                ->with(['cooperative' => function($query) {
                    $query->select('id', 'nom', 'email');
                }, 'images'])
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
                            'nom' => $product->cooperative->nom ?? 'Unknown',
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
                'data' => $products,
                'cooperative' => [
                    'id' => $cooperative->id,
                    'nom' => $cooperative->nom,
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