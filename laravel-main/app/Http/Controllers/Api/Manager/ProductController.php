<?php

namespace App\Http\Controllers\Api\Manager;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display all products with their cooperatives
     */
    public function index()
    {
        try {
            $products = Product::with(['cooperative:id,nom,email,tele,whatsapp', 'images'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($product) {
                    return [
                        'id'             => $product->id,
                        'name'           => $product->name,
                        'description'    => $product->description,
                        'image'          => $product->image,
                        'images'         => $product->images->map(fn($img) => ['id' => $img->id, 'url' => $img->url]),
                        'category'       => $product->category,
                        'price'          => $product->price,
                        'quantity'       => $product->quantity,
                        'cooperative_id' => $product->cooperative_id,
                        'cooperative'    => [
                            'id'       => $product->cooperative->id ?? null,
                            'nom'      => $product->cooperative->nom ?? 'Unknown',
                            'email'    => $product->cooperative->email ?? '',
                            'tele'     => $product->cooperative->tele ?? '',
                            'whatsapp' => $product->cooperative->whatsapp ?? '',
                        ],
                        'created_at' => $product->created_at,
                        'updated_at' => $product->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data'    => $products,
                'count'   => $products->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new product
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'cooperative_id' => 'required|exists:cooperatives,id',
                'name'           => 'required|string|max:255',
                'description'    => 'nullable|string',
                'category'       => 'required|string|max:100',
                'image'          => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
                'images.*'       => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
                'price'          => 'required|numeric|min:0',
                'quantity'       => 'required|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors'  => $validator->errors()
                ], 422);
            }

            // Handle main image
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image     = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/products'), $imageName);
                $imagePath = url('uploads/products/' . $imageName);
            }

            $product = Product::create([
                'cooperative_id' => $request->cooperative_id,
                'name'           => $request->name,
                'description'    => $request->description,
                'category'       => $request->category,
                'image'          => $imagePath,
                'price'          => $request->price,
                'quantity'       => $request->quantity,
            ]);

            // Handle gallery images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $img) {
                    $imgName = time() . '_' . uniqid() . '.' . $img->getClientOriginalExtension();
                    $img->move(public_path('uploads/products'), $imgName);
                    $product->images()->create(['url' => url('uploads/products/' . $imgName)]);
                }
            }

            $product->load(['cooperative:id,nom,email,tele,whatsapp', 'images']);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data'    => [
                    'id'             => $product->id,
                    'name'           => $product->name,
                    'description'    => $product->description,
                    'image'          => $product->image,
                    'images'         => $product->images->map(fn($img) => ['id' => $img->id, 'url' => $img->url]),
                    'category'       => $product->category,
                    'price'          => $product->price,
                    'quantity'       => $product->quantity,
                    'cooperative_id' => $product->cooperative_id,
                    'cooperative'    => [
                        'id'       => $product->cooperative->id ?? null,
                        'nom'      => $product->cooperative->nom ?? 'Unknown',
                        'email'    => $product->cooperative->email ?? '',
                        'tele'     => $product->cooperative->tele ?? '',
                        'whatsapp' => $product->cooperative->whatsapp ?? '',
                    ],
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a specific product
     */
    public function show($id)
    {
        try {
            $product = Product::with(['cooperative:id,nom,email,tele,whatsapp', 'images'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data'    => [
                    'id'             => $product->id,
                    'name'           => $product->name,
                    'description'    => $product->description,
                    'image'          => $product->image,
                    'images'         => $product->images->map(fn($img) => ['id' => $img->id, 'url' => $img->url]),
                    'category'       => $product->category,
                    'price'          => $product->price,
                    'quantity'       => $product->quantity,
                    'cooperative_id' => $product->cooperative_id,
                    'cooperative'    => [
                        'id'       => $product->cooperative->id ?? null,
                        'nom'      => $product->cooperative->nom ?? 'Unknown',
                        'email'    => $product->cooperative->email ?? '',
                        'tele'     => $product->cooperative->tele ?? '',
                        'whatsapp' => $product->cooperative->whatsapp ?? '',
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
    }

    /**
     * Update a product
     */
    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'cooperative_id' => 'sometimes|exists:cooperatives,id',
                'name'           => 'sometimes|string|max:255',
                'description'    => 'sometimes|nullable|string',
                'category'       => 'sometimes|string|max:100',
                'image'          => 'sometimes|nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
                'images.*'       => 'sometimes|nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
                'delete_images'  => 'sometimes|array',
                'delete_images.*'=> 'integer',
                'price'          => 'sometimes|numeric|min:0',
                'quantity'       => 'sometimes|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors'  => $validator->errors()
                ], 422);
            }

            // Handle main image replacement
            if ($request->hasFile('image')) {
                if ($product->image && file_exists(public_path(parse_url($product->image, PHP_URL_PATH)))) {
                    @unlink(public_path(parse_url($product->image, PHP_URL_PATH)));
                }
                $image     = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('uploads/products'), $imageName);
                $product->image = url('uploads/products/' . $imageName);
                $product->save();
            }

            $product->update($request->except(['image', 'images', 'delete_images', '_method']));

            // Add new gallery images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $img) {
                    $imgName = time() . '_' . uniqid() . '.' . $img->getClientOriginalExtension();
                    $img->move(public_path('uploads/products'), $imgName);
                    $product->images()->create(['url' => url('uploads/products/' . $imgName)]);
                }
            }

            // Delete selected gallery images
            if ($request->has('delete_images')) {
                $toDelete = $product->images()->whereIn('id', $request->input('delete_images'))->get();
                foreach ($toDelete as $img) {
                    @unlink(public_path(parse_url($img->url, PHP_URL_PATH)));
                    $img->delete();
                }
            }

            $product->load(['cooperative:id,nom,email,tele,whatsapp', 'images']);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data'    => [
                    'id'             => $product->id,
                    'name'           => $product->name,
                    'description'    => $product->description,
                    'image'          => $product->image,
                    'images'         => $product->images->map(fn($img) => ['id' => $img->id, 'url' => $img->url]),
                    'category'       => $product->category,
                    'price'          => $product->price,
                    'quantity'       => $product->quantity,
                    'cooperative_id' => $product->cooperative_id,
                    'cooperative'    => [
                        'id'       => $product->cooperative->id ?? null,
                        'nom'      => $product->cooperative->nom ?? 'Unknown',
                        'email'    => $product->cooperative->email ?? '',
                        'tele'     => $product->cooperative->tele ?? '',
                        'whatsapp' => $product->cooperative->whatsapp ?? '',
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a product (and its gallery images)
     */
    public function destroy($id)
    {
        try {
            $product = Product::with('images')->findOrFail($id);

            // Delete gallery images from disk
            foreach ($product->images as $img) {
                @unlink(public_path(parse_url($img->url, PHP_URL_PATH)));
                $img->delete();
            }

            // Delete main image from disk
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