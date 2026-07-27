<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IuranStatusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this['id'],
            'nama' => $this['nama'],
            'nomorRumah' => $this['nomorRumah'] ?? '-',
            'statusWarga' => $this['statusWarga'],
            'isKebersihanLunas' => $this['isKebersihanLunas'],
            'isSatpamLunas' => $this['isSatpamLunas'],
            'kebersihanStatus' => $this['kebersihanStatus'],
            'satpamStatus' => $this['satpamStatus'],
            'tunggakan' => $this['tunggakan'],
        ];
    }
}