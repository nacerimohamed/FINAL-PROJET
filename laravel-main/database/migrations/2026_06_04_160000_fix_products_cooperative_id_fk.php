<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the incorrect FK that points to users.id
            $table->dropForeign(['cooperative_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            // Add the correct FK pointing to cooperatives.id
            $table->foreign('cooperative_id')
                  ->references('id')
                  ->on('cooperatives')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['cooperative_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreign('cooperative_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }
};
