<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
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
            'role' => 'required|in:admin,manager',
            'address' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // file upload
        ]);

        // Hash password
        $data['password'] = Hash::make($data['password']);

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
            'role' => 'required|in:admin,manager',
            'address' => 'nullable|string',
            'image' => 'nullable|image|max:2048', // file upload
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

        // Delete user record
        $user->delete();

        // Return JSON with message + user info
        return response()->json([
            'message' => 'User deleted successfully',
            'user' => $userData
        ]);
    }
}
