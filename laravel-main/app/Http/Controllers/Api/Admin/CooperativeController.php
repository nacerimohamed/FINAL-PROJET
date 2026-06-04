<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cooperative;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CooperativeController extends Controller
{
    // =========================================================
    // LIST + FILTER BY VILLE
    // =========================================================
    public function index(Request $request)
    {
        try {
            $query = Cooperative::orderBy('created_at', 'desc');

            // Filter by ville if provided (used by public map)
            if ($request->filled('ville')) {
                $query->whereRaw('LOWER(ville) = ?', [strtolower(trim($request->ville))]);
            }

            $cooperatives = $query->get();

            return response()->json([
                'success' => true,
                'data' => $cooperatives,
                'count' => $cooperatives->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // =========================================================
    // CREATE
    // =========================================================
    public function store(Request $request)
    {
        try {
            // Accept both 'name' (React form) and 'nom' (legacy) aliases
            $nom = $request->input('name') ?? $request->input('nom');
            $adresse = $request->input('address') ?? $request->input('adresse');

            $validator = Validator::make(array_merge($request->all(), ['nom' => $nom]), [
                'nom'     => 'required|string|max:255',
                'email'   => 'required|email|unique:cooperatives,email',
                'description' => 'nullable|string',
                'ville'   => 'nullable|string|max:100',
                'image'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'contact' => 'nullable|string',
                'tele'    => 'nullable|string',
                'instagram' => 'nullable|string',
                'facebook'  => 'nullable|string',
                'whatsapp'  => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            // IMAGE UPLOAD
            $imagePath = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $name = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/cooperatives'), $name);
                $imagePath = 'uploads/cooperatives/' . $name;
            }

            // Admin-created cooperatives are pre-approved
            $cooperative = Cooperative::create([
                'nom'         => $nom,
                'email'       => $request->email,
                'description' => $request->description,
                'adresse'     => $adresse,
                'ville'       => $request->ville,
                'image'       => $imagePath,
                'contact'     => $request->contact,
                'tele'        => $request->tele,
                'instagram'   => $request->instagram,
                'facebook'    => $request->facebook,
                'whatsapp'    => $request->whatsapp,
                'status'      => 'approved',
                'is_approved' => true,
            ]);

            return response()->json([
                'success' => true,
                'data' => $cooperative,
                'message' => 'Coopérative ajoutée avec succès',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // =========================================================
    // SHOW
    // =========================================================
    public function show($id)
    {
        return Cooperative::findOrFail($id);
    }

    // =========================================================
    // UPDATE
    // =========================================================
    public function update(Request $request, $id)
    {
        try {
            $cooperative = Cooperative::findOrFail($id);

            // Accept both 'name'/'address' (React form) and 'nom'/'adresse' (legacy)
            $nom    = $request->input('name') ?? $request->input('nom');
            $adresse = $request->input('address') ?? $request->input('adresse');

            $validator = Validator::make($request->all(), [
                'email'       => 'sometimes|email|unique:cooperatives,email,' . $id,
                'description' => 'nullable|string',
                'ville'       => 'nullable|string|max:100',
                'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'contact'     => 'nullable|string',
                'tele'        => 'nullable|string',
                'instagram'   => 'nullable|string',
                'facebook'    => 'nullable|string',
                'whatsapp'    => 'nullable|string',
                'google_maps_link' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            // IMAGE UPDATE
            if ($request->hasFile('image')) {
                if ($cooperative->image && file_exists(public_path($cooperative->image))) {
                    unlink(public_path($cooperative->image));
                }

                $file = $request->file('image');
                $name = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/cooperatives'), $name);
                $cooperative->image = 'uploads/cooperatives/' . $name;
            }

            // Build update data, mapping React field names to DB field names
            $updateData = $request->except(['image', '_method', 'name', 'address', 'nom', 'adresse']);
            if ($nom)     $updateData['nom']    = $nom;
            if ($adresse) $updateData['adresse'] = $adresse;

            $cooperative->update($updateData);
            if ($request->hasFile('image')) {
                $cooperative->save();
            }

            return response()->json([
                'success' => true,
                'data' => $cooperative->fresh(),
                'message' => 'Coopérative mise à jour avec succès',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    // =========================================================
    // DELETE
    // =========================================================
    public function destroy($id)
    {
        try {
            $cooperative = Cooperative::findOrFail($id);

            if ($cooperative->image && file_exists(public_path($cooperative->image))) {
                @unlink(public_path($cooperative->image));
            }

            // Supprimer également l'utilisateur correspondant (l'email est unique)
            $user = User::where('email', $cooperative->email)->first();
            if ($user) {
                if ($user->image) {
                    Storage::disk('public')->delete($user->image);
                }
                $user->delete(); // Supprime l'utilisateur et cascade vers ses produits
            }

            $cooperative->delete();

            return response()->json([
                'success' => true,
                'message' => 'Deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}