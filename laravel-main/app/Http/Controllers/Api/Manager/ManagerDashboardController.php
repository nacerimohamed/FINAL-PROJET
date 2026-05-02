<?php

namespace App\Http\Controllers\Api\Manager;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Cooperative;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ManagerDashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $totalProducts = Product::count();
            Log::info('[Dashboard] total_products = ' . $totalProducts);

            $outOfStock = Product::where('quantity', 0)->count();
            Log::info('[Dashboard] out_of_stock = ' . $outOfStock);

            $lowStock = Product::whereBetween('quantity', [1, 5])->count();
            Log::info('[Dashboard] low_stock = ' . $lowStock);

            $available = Product::where('quantity', '>', 5)->count();
            Log::info('[Dashboard] available = ' . $available);

            $categories = Product::distinct('cooperative_id')->count('cooperative_id');
            Log::info('[Dashboard] categories = ' . $categories);

            $perCooperative = Cooperative::withCount('products')
                ->orderByDesc('products_count')
                ->get()
                ->map(fn($c) => [
                    'id'             => $c->id,
                    'nom'            => $c->nom,
                    'products_count' => $c->products_count,
                ]);

            $debugInfo = [];
            if (config('app.debug')) {
                $debugInfo = [
                    'db_products_table_count'     => \DB::table('products')->count(),
                    'cooperative_ids_in_products' => \DB::table('products')->distinct()->pluck('cooperative_id'),
                    'cooperatives_count'          => Cooperative::count(),
                ];
                Log::info('[Dashboard] debug_info = ', $debugInfo);
            }

            return response()->json([
                'role'    => 'manager',
                'user'    => $request->user(),
                'message' => 'Bienvenue dans le dashboard manager',
                'stats'   => [
                    'products'           => $totalProducts,
                    'available_products' => $available,
                    'low_stock'          => $lowStock,
                    'out_of_stock'       => $outOfStock,
                    'categories'         => $categories,
                    'orders'             => 0,
                    'per_cooperative'    => $perCooperative,
                ],
                '_debug' => $debugInfo ?: null,
            ]);

        } catch (\Exception $e) {
            Log::error('[Dashboard] Exception: ' . $e->getMessage(), [
                'file'  => $e->getFile(),
                'line'  => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'role'    => 'manager',
                'user'    => $request->user(),
                'message' => 'Dashboard chargé avec erreur partielle',
                'stats'   => [
                    'products'           => 0,
                    'available_products' => 0,
                    'low_stock'          => 0,
                    'out_of_stock'       => 0,
                    'categories'         => 0,
                    'orders'             => 0,
                    'per_cooperative'    => [],
                ],
                'error' => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }
}