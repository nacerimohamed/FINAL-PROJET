<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EasySeeder extends Seeder
{
    public function run()
    {
        echo " Ajout des utilisateurs...\n";

        // أضف مستخدمين فقط
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@test.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'manager@test.com'],
            [
                'name' => 'Manager User',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        echo "Utilisateurs ajoutés!\n";
        echo "Admin: admin@test.com / admin123\n";
        echo "Manager: manager@test.com / manager123\n";
    }
}