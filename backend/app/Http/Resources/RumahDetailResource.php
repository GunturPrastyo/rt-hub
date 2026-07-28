<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class RumahDetailResource extends JsonResource
{
    public function toArray($request)
    {
        // Extract data yang dikirim dari service
        $rumah = $this->resource['rumah'];
        $pemasukan = $this->resource['pemasukan'];

        return [
            'id' => $rumah->id,
            'nomorRumah' => $rumah->nomor_rumah,
            'status' => $rumah->status,
            'penghuniNama' => $rumah->penghuni->nama ?? 'Tidak Ada (Kosong)',
            
            // Format data riwayat penghuni
            'historyPenghuni' => $rumah->historiPenghuni->map(function ($histori) {
                return [
                    'nama' => $histori->penghuni->nama ?? 'Tidak Diketahui',
                    'periodeMasuk' => Carbon::parse($histori->tanggal_masuk)->translatedFormat('d M Y'),
                    'periodeKeluar' => $histori->tanggal_keluar 
                        ? Carbon::parse($histori->tanggal_keluar)->translatedFormat('d M Y') 
                        : null,
                    'statusKontrak' => $histori->tanggal_keluar ? 'Selesai' : 'Aktif',
                ];
            }),

            // Format data riwayat pembayaran
            'historyPembayaran' => $pemasukan->map(function ($pay) {
                return [
                    'status' => 'Lunas', 
                    'bulan' => Carbon::parse($pay->tanggal_bayar)->translatedFormat('M Y'),
                    'penghuniSaatItu' => $pay->penghuni->nama ?? '-',
                    'nominal' => $pay->total,
                ];
            }),
        ];
    }
}