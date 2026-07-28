<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\IuranStatusResource;
use App\Services\PemasukanService;
use App\Models\Pengaturan;
use Illuminate\Http\Request;

class PemasukanController extends Controller
{
    public function __construct(protected PemasukanService $service) {}

    public function statusIuran(Request $request)
    {
        // Tangkap parameter pencarian dari frontend
        $search = $request->query('search');

        // Panggil calculateStatusIuran dengan batasan 10 per halaman
        $statusData = $this->service->calculateStatusIuran(10, $search);

        // Resource otomatis melampirkan metadata paginasi (current_page, total, dll)
        return IuranStatusResource::collection($statusData);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'penghuniId' => 'required|exists:penghuni,id',
            'bulanKebersihan' => 'required|numeric|min:0',
            'bulanSatpam' => 'required|numeric|min:0',
            'tarifKebersihan' => 'nullable|numeric|min:0', // <-- Validasi baru
            'tarifSatpam' => 'nullable|numeric|min:0',     // <-- Validasi baru
        ]);

        $this->service->storePemasukan($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran iuran berhasil dicatat.'
        ], 201);
    }




    // Method untuk mengambil tarif master yang aktif
    public function getTarifMaster()
    {
        $tarifKebersihan = Pengaturan::where('key', 'tarif_kebersihan')->value('value') ?? 35000;
        $tarifSatpam = Pengaturan::where('key', 'tarif_satpam')->value('value') ?? 80000;

        return response()->json([
            'success' => true,
            'tarif_kebersihan' => (int) $tarifKebersihan,
            'tarif_satpam' => (int) $tarifSatpam
        ]);
    }

    // Method untuk menyimpan/mengupdate tarif master secara permanen
    public function updateTarifMaster(Request $request)
    {
        $validated = $request->validate([
            'tarif_kebersihan' => 'required|numeric|min:0',
            'tarif_satpam' => 'required|numeric|min:0',
        ]);

        Pengaturan::updateOrCreate(
            ['key' => 'tarif_kebersihan'],
            ['value' => $validated['tarif_kebersihan']]
        );

        Pengaturan::updateOrCreate(
            ['key' => 'tarif_satpam'],
            ['value' => $validated['tarif_satpam']]
        );

        return response()->json([
            'success' => true,
            'message' => 'Tarif master berhasil diperbarui secara permanen.'
        ]);
    }
}
