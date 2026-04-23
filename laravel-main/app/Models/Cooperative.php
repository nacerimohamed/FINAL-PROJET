<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cooperative extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'ville',
        'description',
        'adresse',
        'region',       // ← added for Drâa-Tafilalet map feature
        'image',
        'contact',
        'tele',
        'instagram',
        'facebook',
        'whatsapp',
    ];

    /**
     * Get the products for the cooperative.
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'cooperative_id');
    }
}