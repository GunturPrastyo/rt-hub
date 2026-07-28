<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pemasukan', function (Blueprint $table) {
            $table->id();

            $table->foreignId('penghuni_id')->constrained('penghuni')->cascadeOnDelete();
            
            $table->foreignId('rumah_id')->constrained('rumah')->cascadeOnDelete(); 
            
            $table->integer('bulan_kebersihan')->default(0);
            $table->integer('bulan_satpam')->default(0);
            $table->integer('total');
            $table->date('tanggal_bayar');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pemasukan');
    }
};