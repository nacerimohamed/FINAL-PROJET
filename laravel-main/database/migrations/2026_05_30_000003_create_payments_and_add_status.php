<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Add status to users and cooperatives
        if (!Schema::hasColumn('users', 'status')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('status')->default('pending')->after('is_approved');
            });
        }

        if (!Schema::hasColumn('cooperatives', 'status')) {
            Schema::table('cooperatives', function (Blueprint $table) {
                $table->string('status')->default('pending');
            });
        }

        // Create payments table
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('phone');
            $table->string('plan');
            $table->string('transaction_id')->unique();
            $table->string('screenshot_path')->nullable();
            $table->string('status')->default('pending'); // pending, accepted, rejected
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('cooperatives', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
