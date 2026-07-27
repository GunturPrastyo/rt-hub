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
        Schema::create('histori_penghuni', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rumah_id')->constrained('Rumah')->cascadeOnDelete();
            $table->foreignId('penghuni_id')->constrained('Penghuni')->cascadeOnDelete();

            $table->date('tanggal_masuk');
            $table->date('tanggal_keluar')->nullable(); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('histori_penghuni');
    }
};
