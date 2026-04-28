<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    if (!Schema::hasColumn('cooperatives', 'ville')) {
        Schema::table('cooperatives', function (Blueprint $table) {
            $table->string('ville')->nullable();
        });
    }
}

public function down()
{
    Schema::table('cooperatives', function (Blueprint $table) {
        $table->dropColumn('ville');
    });
}
};
