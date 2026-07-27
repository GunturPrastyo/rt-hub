<?php

namespace App\Services;

use App\Models\Rumah;
use App\Models\HistoriPenghuni;
use Carbon\Carbon;

class RumahService
{
    public function storeRumah(array $data)
    {
        $rumah = Rumah::create($data);

        if (!empty($data['penghuni_id'])) {
            HistoriPenghuni::create([
                'rumah_id' => $rumah->id,
                'penghuni_id' => $data['penghuni_id'],
                'tanggal_masuk' => Carbon::now()->toDateString(),
            ]);
        }

        return $rumah;
    }

    public function updateRumah(Rumah $rumah, array $data)
    {
        $penghuniLama = $rumah->penghuni_id;
        $penghuniBaru = $data['penghuni_id'] ?? null;

        $rumah->update($data);

        if ($penghuniLama !== $penghuniBaru) {
            
            if ($penghuniLama) {
                HistoriPenghuni::where('rumah_id', $rumah->id)
                    ->where('penghuni_id', $penghuniLama)
                    ->whereNull('tanggal_keluar')
                    ->update(['tanggal_keluar' => Carbon::now()->toDateString()]);
            }

            if ($penghuniBaru) {
                HistoriPenghuni::create([
                    'rumah_id' => $rumah->id,
                    'penghuni_id' => $penghuniBaru,
                    'tanggal_masuk' => Carbon::now()->toDateString(),
                ]);
            }
        }

        return $rumah;
    }

    public function deleteRumah(Rumah $rumah)
    {
        return $rumah->delete();
    }
}