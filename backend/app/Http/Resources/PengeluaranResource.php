<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PengeluaranResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'keterangan' => $this->keterangan,
            'kategori' => $this->kategori,
            'nominal' => (int) $this->nominal,
            'tanggal' => $this->tanggal,
        ];
    }
}