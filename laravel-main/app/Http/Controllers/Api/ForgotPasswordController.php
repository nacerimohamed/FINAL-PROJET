<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\ResetPasswordMail;
use Carbon\Carbon;

class ForgotPasswordController extends Controller
{
    /**
     * Send OTP to the user's email.
     */
    public function sendResetOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();
        $cooperative = null;

        if (!$user) {
            // Check if it's a cooperative that doesn't have a User account yet
            $cooperative = \App\Models\Cooperative::where('email', $request->email)->first();
            
            if (!$cooperative) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun utilisateur trouvé avec cette adresse email.'
                ], 404);
            }
        }

        $name = $user ? $user->name : $cooperative->nom;

        // Generate a 6-digit OTP
        $otp = rand(100000, 999999);

        // Delete old OTPs for this email
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Insert new OTP with expiration time (created_at)
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($otp), // Securely hash the OTP in database
            'created_at' => Carbon::now()
        ]);

        // Send Email
        try {
            Mail::to($request->email)->send(new ResetPasswordMail($otp, $name));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Mail Error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur SMTP : ' . $e->getMessage()
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Un code de vérification a été envoyé à votre adresse email.'
        ]);
    }

    /**
     * Verify OTP and reset password.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
            'password' => 'required|string|min:6'
        ]);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Code invalide ou expiré.'
            ], 400);
        }

        // Security: Check if OTP is expired (e.g., older than 15 minutes)
        if (Carbon::parse($resetRecord->created_at)->addMinutes(15)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Le code de vérification a expiré.'
            ], 400);
        }

        // Security: Verify the hashed OTP
        if (!Hash::check($request->otp, $resetRecord->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Le code de vérification est incorrect.'
            ], 400);
        }

        // Update or create password
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $user->password = Hash::make($request->password);
            $user->save();
        } else {
            // It might be a cooperative without a user account
            $cooperative = \App\Models\Cooperative::where('email', $request->email)->first();
            if ($cooperative) {
                User::create([
                    'name' => $cooperative->nom,
                    'email' => $cooperative->email,
                    'password' => Hash::make($request->password),
                    'role' => 'cooperative',
                    'tele' => $cooperative->tele,
                    'address' => $cooperative->adresse,
                    'description' => $cooperative->description,
                    'is_approved' => true // Already in cooperatives table, so consider approved
                ]);
            }
        }

        // Delete the token so it cannot be used again
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Votre mot de passe a été réinitialisé avec succès.'
        ]);
    }
}
