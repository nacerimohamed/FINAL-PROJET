<?php

namespace App\Http\Controllers\Api\Cooperative;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
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
            $coopId = \App\Models\Cooperative::where('email', Auth::user()->email)->value('id') ?? Auth::id();
            $products = Product::where('cooperative_id', $coopId)
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
                'images' => 'required|array|min:3|max:5',
                'images.*' => 'image|mimes:jpg,jpeg,png,gif,webp|max:2048',
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
                'gratuit' => 1,
                'standard' => 5,
                'premium' => 15,
                'professionnel' => null, // unlimited
            ];

            $maxProducts = $limits[$plan] ?? 5;
            if ($maxProducts !== null) {
                $coopId = \App\Models\Cooperative::where('email', Auth::user()->email)->value('id') ?? Auth::id();
                $currentCount = Product::where('cooperative_id', $coopId)->count();
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
            $uploadedImages = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $image->move(public_path('uploads/products'), $imageName);
                    $url = url('uploads/products/' . $imageName);
                    $uploadedImages[] = $url;
                    if ($index === 0) {
                        $imagePath = $url;
                    }
                }
            }

            $coopId = \App\Models\Cooperative::where('email', Auth::user()->email)->value('id') ?? Auth::id();

            $product = Product::create([
                'cooperative_id' => $coopId,
                'name' => $request->name,
                'description' => $request->description,
                'category' => $request->category,
                'image' => $imagePath,
                'price' => $request->price,
                'quantity' => $request->quantity,
            ]);

            foreach ($uploadedImages as $url) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $url,
                ]);
            }

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
            $coopId = \App\Models\Cooperative::where('email', Auth::user()->email)->value('id') ?? Auth::id();
            $product = Product::with('images')->where('cooperative_id', $coopId)->findOrFail($id);

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
            $coopId = \App\Models\Cooperative::where('email', Auth::user()->email)->value('id') ?? Auth::id();
            $product = Product::with('images')->where('cooperative_id', $coopId)->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|nullable|string',
                'category' => 'sometimes|string|max:100',
                'images' => 'sometimes|array',
                'images.*' => 'image|mimes:jpg,jpeg,png,gif,webp|max:2048',
                'retained_images' => 'sometimes|array',
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

            // Handle image updates (retaining + adding new)
            $hasImageUpdate = $request->has('retained_images') || $request->hasFile('images');
            if ($hasImageUpdate) {
                $retainedIds = $request->input('retained_images', []);
                if (!is_array($retainedIds)) {
                    $retainedIds = json_decode($retainedIds, true) ?: [];
                }
                
                // Ensure values are integers
                $retainedIds = array_map('intval', $retainedIds);

                // Ensure retained images belong to this product
                $productImageIds = $product->images->pluck('id')->toArray();
                foreach ($retainedIds as $idVal) {
                    if (!in_array($idVal, $productImageIds)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Images invalides.',
                        ], 422);
                    }
                }

                $newImagesCount = $request->hasFile('images') ? count($request->file('images')) : 0;
                $totalCount = count($retainedIds) + $newImagesCount;

                if ($totalCount < 3 || $totalCount > 5) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le produit doit avoir entre 3 et 5 images.',
                        'errors' => [
                            'images' => ['Le produit doit avoir entre 3 et 5 images.']
                        ]
                    ], 422);
                }

                // Delete physical files and records of images that are not retained
                foreach ($product->images as $img) {
                    if (!in_array($img->id, $retainedIds)) {
                        $filePath = public_path(parse_url($img->url, PHP_URL_PATH));
                        if (file_exists($filePath)) {
                            @unlink($filePath);
                        }
                        $img->delete();
                    }
                }

                // Save new images
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                        $image->move(public_path('uploads/products'), $imageName);
                        $url = url('uploads/products/' . $imageName);

                        ProductImage::create([
                            'product_id' => $product->id,
                            'url' => $url,
                        ]);
                    }
                }

                // Refresh images relationship to set first image
                $product->refresh();
                $firstImage = $product->images()->first();
                $product->image = $firstImage ? $firstImage->url : null;
                $product->save();
            }

            $product->update($request->except(['image', 'images', 'retained_images', '_method']));

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
            $coopId = \App\Models\Cooperative::where('email', Auth::user()->email)->value('id') ?? Auth::id();
            $product = Product::with('images')->where('cooperative_id', $coopId)->findOrFail($id);
            
            foreach ($product->images as $img) {
                $filePath = public_path(parse_url($img->url, PHP_URL_PATH));
                if (file_exists($filePath)) {
                    @unlink($filePath);
                }
            }

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
