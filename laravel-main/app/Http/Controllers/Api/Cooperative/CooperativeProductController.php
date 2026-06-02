<?php

namespace App\Http\Controllers\Api\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CooperativeProductController extends Controller
{
    /**
     * Get products owned by the authenticated cooperative
     */
    public function index()
    {
        try {
            $products = Auth::user()->products()
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $products,
                'count' => $products->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new product for the authenticated cooperative
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category' => 'nullable|string|max:100',
                'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
                'price' => 'required|numeric|min:0',
                'quantity' => 'required|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // ========== PLAN LIMIT CHECK ==========
            $user = Auth::user();
            $plan = $user->plan ?? 'gratuit';
            $limits = [
                'gratuit' => 5,
                'standard' => 20,
                'premium' => 50,
                'professionnel' => null, // unlimited
            ];

            $maxProducts = $limits[$plan] ?? 5;
            if ($maxProducts !== null) {
                $currentCount = $user->products()->count();
                if ($currentCount >= $maxProducts) {
                    $planLabels = [
                        'gratuit' => 'gratuit',
                        'standard' => 'standard',
                        'premium' => 'premium',
                    ];
                    $label = $planLabels[$plan] ?? $plan;
                    return response()->json([
                        'success' => false,
                        'message' => "Limite atteinte ({$maxProducts} produits max pour le plan {$label}). Veuillez passer à une offre supérieure."
                    ], 403);
                }
            }
            // ========================================

            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/products'), $imageName);
                $imagePath = url('uploads/products/' . $imageName);
            }

            $product = Product::create([
                'cooperative_id' => Auth::id(),
                'name' => $request->name,
                'description' => $request->description,
                'category' => $request->category,
                'image' => $imagePath,
                'price' => $request->price,
                'quantity' => $request->quantity,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a specific product owned by the cooperative
     */
    public function show($id)
    {
        try {
            $product = Auth::user()->products()->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found or unauthorized'
            ], 404);
        }
    }

    /**
     * Update a product owned by the cooperative
     */
    public function update(Request $request, $id)
    {
        try {
            $product = Auth::user()->products()->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|nullable|string',
                'category' => 'sometimes|string|max:100',
                'image' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
                'price' => 'sometimes|numeric|min:0',
                'quantity' => 'sometimes|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image && file_exists(public_path(parse_url($product->image, PHP_URL_PATH)))) {
                    @unlink(public_path(parse_url($product->image, PHP_URL_PATH)));
                }
                
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/products'), $imageName);
                $product->image = url('uploads/products/' . $imageName);
            }

            $product->update($request->except(['image', '_method']));

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a product owned by the cooperative
     */
    public function destroy($id)
    {
        try {
            $product = Auth::user()->products()->findOrFail($id);
            
            if ($product->image && file_exists(public_path(parse_url($product->image, PHP_URL_PATH)))) {
                @unlink(public_path(parse_url($product->image, PHP_URL_PATH)));
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
