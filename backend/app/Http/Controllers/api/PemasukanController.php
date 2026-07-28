<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\IuranStatusResource;
use App\Services\PemasukanService;
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
            'penghuniId' => 'required|exists:Penghuni,id',
            'bulanKebersihan' => 'required|numeric|min:0',
            'bulanSatpam' => 'required|numeric|min:0',
        ]);

        $this->service->storePemasukan($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran iuran berhasil dicatat.'
        ], 201);
    }
}