<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'role' => 'admin',
            'stats' => [
                'total_users' => User::count(),
                'admins' => User::where('role', 'admin')->count(),
                'manager' => User::where('role', 'manager')->count(),
                
            ],
            'message' => 'Bienvenue dans le dashboard Admin'
        ]);
    }
}
