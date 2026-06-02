<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Add this

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // Add HasApiTokens

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
protected $fillable = [
    'name',
    'email',
    'password',
    'role',
    'address',
    'image',
    'tele',
    'description',
    'is_approved',
    'plan',
    'status',
];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getNomAttribute()
    {
        return $this->name;
    }

    public function getWhatsappAttribute()
    {
        return $this->tele;
    }

    /**
     * Get the products for the cooperative (user).
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'cooperative_id');
    }
}