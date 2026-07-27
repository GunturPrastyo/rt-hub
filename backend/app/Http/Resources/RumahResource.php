<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RumahResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nomorRumah' => $this->nomor_rumah,
            'blok' => $this->blok,
            'status' => $this->status,
            'penghuniId' => $this->penghuni_id,
           
            'penghuniNama' => $this->penghuni ? $this->penghuni->nama : '-',
            'tipePenghuni' => $this->penghuni ? $this->penghuni->status_warga : '-',
            
            'historyPenghuni' => [],
            'historyPembayaran' => []
        ];
    }
}