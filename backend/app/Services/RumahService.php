<?php

namespace App\Services;

use App\Models\Rumah;
use App\Models\HistoriPenghuni;
use App\Models\Pemasukan;
use Carbon\Carbon;

class RumahService
{
    public function getDetailRumah(Rumah $rumah)
    {
        // 1. Eager load data penghuni saat ini dan histori penghuni sebelumnya
        $rumah->load(['penghuni', 'historiPenghuni.penghuni']);

        // 2. Kumpulkan ID penghuni yang pernah menempati rumah ini
        $penghuniIds = $rumah->historiPenghuni->pluck('penghuni_id')->filter()->unique();

        // 3. Tarik data pembayaran iuran khusus untuk penghuni-penghuni tersebut
        $pemasukan = Pemasukan::with('penghuni')
            ->whereIn('penghuni_id', $penghuniIds)
            ->orderBy('tanggal_bayar', 'desc')
            ->get();

        // Kembalikan array berisi instance Rumah dan koleksi Pemasukan
        return [
            'rumah' => $rumah,
            'pemasukan' => $pemasukan
        ];
    }

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

    public function getHistoryPenghuniPaginated(Rumah $rumah, $perPage = 5)
    {
        // Relasi historiPenghuni sudah diurutkan desc di model
        return $rumah->historiPenghuni()->with('penghuni')->paginate($perPage);
    }

    public function getHistoryPembayaranPaginated(Rumah $rumah, $perPage = 10)
    {
       
        return Pemasukan::with('penghuni')
            ->where('rumah_id', $rumah->id)
            ->orderBy('tanggal_bayar', 'desc')
            ->paginate($perPage);
    }

    public function deleteRumah(Rumah $rumah)
    {
        return $rumah->delete();
    }
}
