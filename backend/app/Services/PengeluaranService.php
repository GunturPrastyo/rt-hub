<?php

namespace App\Services;

use App\Models\Pengeluaran;

class PengeluaranService
{
    public function getAllPengeluaran()
    {
        return Pengeluaran::orderBy('tanggal', 'desc')->get();
    }

    public function storePengeluaran(array $data)
    {
        return Pengeluaran::create($data);
    }
}