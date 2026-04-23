<?php

namespace App\Http\Controllers\Api\Manager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ManagerDashboardController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'role' => 'manager',
            'user' => $request->user(),
            'message' => 'Bienvenue dans le dashboard manager'
        ]);
    }
}
