<?php

namespace App\Http\Resources;

use Carbon\Carbon;
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

            'historyPenghuni' => $this->historiPenghuni->map(function ($history) {
                return [
                    'nama' => $history->penghuni ? $history->penghuni->nama : 'Warga Dihapus',
                    'periodeMasuk' => Carbon::parse($history->tanggal_masuk)->translatedFormat('M Y'),
                    'periodeKeluar' => $history->tanggal_keluar ? Carbon::parse($history->tanggal_keluar)->translatedFormat('M Y') : null,
                    'statusKontrak' => $history->tanggal_keluar ? 'Selesai' : 'Aktif',
                ];
            }),
            'historyPembayaran' => []
        ];
    }
}
