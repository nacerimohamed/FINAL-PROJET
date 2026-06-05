<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\User;
use App\Models\Cooperative;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    // Submit a manual payment
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'plan' => 'required|string|in:standard,premium,professionnel',
            'transaction_id' => 'required|string|unique:payments',
            'screenshot' => 'nullable|image|max:2048', // 2MB max
        ]);

        $paymentData = $request->only('user_id', 'name', 'phone', 'plan', 'transaction_id');
        $paymentData['status'] = 'pending';

        if ($request->hasFile('screenshot')) {
            $path = $request->file('screenshot')->store('payments', 'public');
            $paymentData['screenshot_path'] = '/storage/' . $path;
        }

        $payment = Payment::create($paymentData);

        return response()->json([
            'success' => true,
            'message' => 'Paiement soumis avec succès. En attente de validation par l\'administrateur.',
            'payment' => $payment
        ], 201);
    }

    // Admin: List all payments
    public function index()
    {
        $payments = Payment::with('user:id,name,email')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    // Admin: Accept or Reject Payment
    public function updateStatus(Request $request, $id)
{
    $request->validate([
        'status' => 'required|string|in:accepted,rejected'
    ]);

    $payment = Payment::findOrFail($id);
    $payment->status = $request->status;
    $payment->save();

    return response()->json([
        'success' => true,
        'message' => 'Statut de paiement mis à jour avec succès.'
    ]);
}
}
