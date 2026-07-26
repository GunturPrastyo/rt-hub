<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PenghuniResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'telepon' => $this->telepon,
            'statusWarga' => $this->status_warga,
            'statusPernikahan' => $this->status_pernikahan,
            'rumahSaatIni' => $this->rumah->pluck('nomor_rumah')->implode(', ') ?: 'Belum Menempati',
            'fotoKtp' => $this->foto_ktp ? asset('storage/' . $this->foto_ktp) : null,
        ];
    }
}