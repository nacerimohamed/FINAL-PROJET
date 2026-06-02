<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'plan',
        'transaction_id',
        'screenshot_path',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
