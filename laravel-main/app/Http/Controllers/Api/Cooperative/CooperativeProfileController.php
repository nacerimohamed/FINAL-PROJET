<?php

namespace App\Http\Controllers\Api\Cooperative;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Models\Product;

class CooperativeProfileController extends Controller
{
    /**
     * Get dashboard statistics for the authenticated cooperative.
     */
    public function dashboardStats()
    {
        $coopId = Auth::id();

        $totalProducts = Product::where('cooperative_id', $coopId)->count();
        $availableProducts = Product::where('cooperative_id', $coopId)->where('quantity', '>', 10)->count();
        $lowStock = Product::where('cooperative_id', $coopId)->whereBetween('quantity', [1, 10])->count();
        $outOfStock = Product::where('cooperative_id', $coopId)->where('quantity', '<=', 0)->count();
        $categories = Product::where('cooperative_id', $coopId)->distinct('category')->count('category');

        return response()->json([
            'success' => true,
            'stats' => [
                'total' => $totalProducts,
                'available' => $availableProducts,
                'low_stock' => $lowStock,
                'out_of_stock' => $outOfStock,
                'categories' => $categories,
            ]
        ]);
    }

    /**
     * Update the authenticated cooperative's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'tele' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'password' => 'nullable|string|min:6'
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->tele = $request->tele;
        $user->address = $request->adresse;
        $user->description = $request->description;

        if ($request->hasFile('image')) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $imagePath = $request->file('image')->store('users', 'public');
            $user->image = $imagePath;
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }
}
