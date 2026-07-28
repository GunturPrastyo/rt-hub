<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengaturan', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Masukkan data default awal agar sistem langsung siap pakai
        DB::table('pengaturan')->insert([
            ['key' => 'tarif_kebersihan', 'value' => '35000', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'tarif_satpam', 'value' => '80000', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaturan');
    }
};