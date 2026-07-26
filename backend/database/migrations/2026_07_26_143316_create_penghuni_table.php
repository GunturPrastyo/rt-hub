<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penghuni', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); 
            $table->string('telepon'); 
            $table->enum('status_warga', ['Tetap', 'Kontrak']); 
            $table->enum('status_pernikahan', ['Menikah', 'Belum Menikah']); 
            $table->string('foto_ktp')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penghuni');
    }
};
