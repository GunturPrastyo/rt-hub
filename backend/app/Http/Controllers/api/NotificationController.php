<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PemasukanService;
use Carbon\Carbon;


class NotificationController extends Controller
{
    public function __construct(protected PemasukanService $pemasukanService) {}

    public function index()
    {
        Carbon::setLocale('id'); // Set bahasa waktu ke Indonesia
        $notifications = collect();
        $idCounter = 1;

        // Memanggil service dengan limit besar (100) untuk mengecek semua warga
        $statusData = $this->pemasukanService->calculateStatusIuran(100);
        $wargaList = collect($statusData->items());
        
        // Filter HANYA warga yang nunggak (belum lunas)
        // Saya ubah limitnya menjadi take(10) agar menampilkan lebih banyak daftar tunggakan
        $nunggakList = $wargaList->filter(function ($warga) {
            return !$warga['isKebersihanLunas'] || !$warga['isSatpamLunas'];
        })->take(10); 

        foreach ($nunggakList as $warga) {
            // Cari tahu tunggakan terlama antara kebersihan dan satpam
            $bulanNunggak = max($warga['tunggakan']['kebersihan'], $warga['tunggakan']['satpam']);
            
            $notifications->push([
                'id' => 'notif-n-' . $idCounter++,
                'title' => 'Iuran Belum Dibayar',
                'message' => 'Rumah ' . $warga['nomorRumah'] . ' nunggak ' . $bulanNunggak . ' bulan.',
                'type' => 'warning',
                'time' => 'Perlu ditagih',
                'link' => '/transaksi'
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $notifications->values()->all()
        ]);
    }
}