<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the `region` column to the cooperatives table.
     * This column stores the Drâa-Tafilalet province name
     * (e.g. Tinghir, Zagora, Midelt, Ouarzazate, Errachidia).
     *
     * Run with: php artisan migrate
     */
    public function up(): void
    {
        Schema::table('cooperatives', function (Blueprint $table) {
            // Add after 'adresse' if it exists, otherwise just append
            $table->string('region', 100)->nullable()->after('adresse');
        });
    }

    public function down(): void
    {
        Schema::table('cooperatives', function (Blueprint $table) {
            $table->dropColumn('region');
        });
    }
};