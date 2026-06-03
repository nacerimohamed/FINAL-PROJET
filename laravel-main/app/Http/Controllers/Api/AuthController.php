<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // ==============================
    // REGISTER
    // ==============================
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,manager,cooperative',
            'address' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
            'tele' => 'nullable|string|max:20',
            'description' => 'nullable|string',
        ]);

        $data = $request->only('name', 'email', 'role', 'address', 'tele', 'description');
        $data['password'] = Hash::make($request->password);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('users', 'public');
        }

        $user = User::create($data);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'address' => $user->address,
                'tele' => $user->tele,
                'description' => $user->description,
                'image' => $user->image,
            ]
        ], 201);
    }

    // ==============================
    // REGISTER COOPERATIVE
    // ==============================
    public function registerCooperative(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'tele' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'plan' => 'nullable|string|in:gratuit,standard,premium,professionnel',
            'ville' => 'required|string',
        ]);

        $data = $request->only('name', 'email', 'tele', 'address', 'description');
        $data['role'] = 'cooperative';
        $data['password'] = Hash::make($request->password);
        
        $plan = $request->plan ?? 'gratuit';
        $data['plan'] = $plan;

        // FREE plan → auto-approved, can login immediately
        // PAID plans → pending, needs admin approval after payment
        if ($plan === 'gratuit') {
            $data['is_approved'] = true;
            $data['status'] = 'active';
        } else {
            $data['is_approved'] = false;
            $data['status'] = 'pending';
        }

        $user = User::create($data);

        // CREATE COOPERATIVE SO IT SHOWS UP ON MAP AND PUBLIC LISTS
        \App\Models\Cooperative::create([
            'nom' => $request->name,
            'email' => $request->email,
            'description' => $request->description,
            'adresse' => $request->address,
            'ville' => $request->ville,
            'tele' => $request->tele,
        ]);

        $isPaid = $plan !== 'gratuit';

        return response()->json([
            'success' => true,
            'message' => $isPaid
                ? 'Inscription réussie. Veuillez procéder au paiement pour activer votre compte.'
                : 'Inscription réussie ! Vous pouvez maintenant vous connecter.',
            'pending_approval' => $isPaid,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'address' => $user->address,
                'tele' => $user->tele,
                'description' => $user->description,
                'plan' => $user->plan,
                'status' => $user->status,
                'ville' => $request->ville,
            ]
        ], 201);
    }

    // ==============================
    // LOGIN
    // ==============================
    public function login(Request $request)
    {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Veuillez remplir tous les champs correctement.',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email ou mot de passe incorrect.'
                ], 401);
            }

            // Vérifier si le compte est approuvé (uniquement pour les coopératives PAYANTES)
            if ($user->role === 'cooperative' && $user->plan !== 'gratuit') {
                if ($user->status === 'rejected') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Votre demande a été rejetée. Veuillez contacter l\'administrateur.'
                    ], 403);
                }
                
                if (!$user->is_approved || $user->status === 'pending') {
                    return response()->json([
                        'success' => false,
                        'message' => 'Votre compte est en attente d\'approbation ou de validation de paiement.'
                    ], 403);
                }
            }

            // Supprimer les anciens tokens
            $user->tokens()->delete();
            
            // Créer nouveau token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'address' => $user->address,
                    'tele' => $user->tele,
                    'description' => $user->description,
                    'image' => $user->image,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }

    // ==============================
    // LOGOUT
    // ==============================
    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Déconnecté avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    // ==============================
    // ME - Get current logged-in user
    // ==============================
    public function me(Request $request)
    {
        try {
            $user = $request->user();

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'address' => $user->address,
                    'tele' => $user->tele,
                    'description' => $user->description,
                    'image' => $user->image,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }
}