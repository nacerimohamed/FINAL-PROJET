<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cooperative;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserManagementController extends Controller
{
    // List all users
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Create user
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,manager,cooperative',
            'address' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // file upload
            'is_approved' => 'nullable|boolean',
        ]);

        // Hash password
        $data['password'] = Hash::make($data['password']);

        // Default approval status
        if (!isset($data['is_approved'])) {
            $data['is_approved'] = $data['role'] !== 'cooperative';
        }

        // Upload image if exists
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('users', 'public');
        }

        $user = User::create($data);

        return response()->json($user, 201);
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string',
            'email' => "required|email|unique:users,email,$id",
            'role' => 'required|in:admin,manager,cooperative',
            'address' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // file upload
            'is_approved' => 'nullable|boolean',
        ]);

        // Upload new image if exists
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $data['image'] = $request->file('image')->store('users', 'public');
        }

        $user->update($data);

        return response()->json($user);
    }

    // Approve cooperative/user
    public function approve($id)
    {
        $user = User::findOrFail($id);
        $user->is_approved = true;
        $user->status = 'approved';
        $user->save();

        // Sync the cooperatives table as well (same email = same cooperative)
        Cooperative::where('email', $user->email)->update([
            'is_approved' => true,
            'status'      => 'approved',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Compte coopérative approuvé avec succès.',
            'user'    => $user
        ]);
    }

    // Delete user
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Store user data before delete
        $userData = $user->toArray();

        // Delete image if exists
        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }

        // If the deleted user is a cooperative, delete their cooperative profile too
        if ($user->role === 'cooperative') {
            $cooperative = Cooperative::where('email', $user->email)->first();
            if ($cooperative) {
                if ($cooperative->image && file_exists(public_path($cooperative->image))) {
                    @unlink(public_path($cooperative->image));
                }
                $cooperative->delete();
            }
        }

        // Delete user record
        $user->delete();

        // Return JSON with message + user info
        return response()->json([
            'message' => 'User deleted successfully',
            'user' => $userData
        ]);
    }
}
