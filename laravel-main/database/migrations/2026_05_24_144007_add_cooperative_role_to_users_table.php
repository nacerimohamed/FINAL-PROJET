<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Expand the role ENUM to include 'cooperative'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'cooperative') NOT NULL DEFAULT 'manager'");
    }

    public function down(): void
    {
        // Revert back to only admin and manager
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager') NOT NULL DEFAULT 'manager'");
    }
};
