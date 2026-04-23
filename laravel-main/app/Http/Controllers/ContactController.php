<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // Recevoir un nouveau message
    public function store(Request $request)
    {
        $contact = Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'message' => $request->message,
            'status' => 'non lu'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès',
            'data' => $contact
        ], 201);
    }

    // Récupérer les messages récents (pour le dashboard)
    public function getRecentMessages()
    {
        $messages = Contact::orderBy('created_at', 'desc')->take(10)->get();
        
        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    // Marquer un message comme lu
    public function markAsRead($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->status = 'lu';
        $contact->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Message marqué comme lu'
        ]);
    }
}