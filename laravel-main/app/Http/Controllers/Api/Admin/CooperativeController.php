<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cooperative;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CooperativeController extends Controller
{
    // =========================================================
    // LIST + FILTER BY VILLE
    // =========================================================
    public function index(Request $request)
    {
        try {
            $query = Cooperative::orderBy('created_at', 'desc');

            // ✅ FILTER BY VILLE (IMPORTANT FIX)
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
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'email' => 'required|email|unique:cooperatives,email',
                'description' => 'nullable|string',
                'adresse' => 'nullable|string',

                // ✅ IMPORTANT FIELD
                'ville' => 'nullable|string|max:100',

                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'contact' => 'nullable|string',
                'tele' => 'nullable|string',
                'instagram' => 'nullable|string',
                'facebook' => 'nullable|string',
                'whatsapp' => 'nullable|string',
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

            $cooperative = Cooperative::create([
                'nom' => $request->nom,
                'email' => $request->email,
                'description' => $request->description,
                'adresse' => $request->adresse,

                // ✅ FIXED FIELD
                'ville' => $request->ville,

                'image' => $imagePath,
                'contact' => $request->contact,
                'tele' => $request->tele,
                'instagram' => $request->instagram,
                'facebook' => $request->facebook,
                'whatsapp' => $request->whatsapp,
            ]);

            return response()->json([
                'success' => true,
                'data' => $cooperative,
                'message' => 'Created successfully',
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

            $validator = Validator::make($request->all(), [
                'nom' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:cooperatives,email,' . $id,
                'description' => 'nullable|string',
                'adresse' => 'nullable|string',

                // ✅ FIXED
                'ville' => 'nullable|string|max:100',

                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
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

            // UPDATE DATA
            $cooperative->update($request->except(['image', '_method']));

            return response()->json([
                'success' => true,
                'data' => $cooperative,
                'message' => 'Updated successfully',
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
                unlink(public_path($cooperative->image));
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