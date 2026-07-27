<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PengeluaranResource;
use App\Services\PengeluaranService;
use Illuminate\Http\Request;

class PengeluaranController extends Controller
{
    public function __construct(protected PengeluaranService $service) {}

    public function index()
    {
        $pengeluarans = $this->service->getAllPengeluaran();
        return PengeluaranResource::collection($pengeluarans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'keterangan' => 'required|string',
            'kategori' => 'required|string',
            'nominal' => 'required|numeric',
            'tanggal' => 'required|date',
        ]);

        $pengeluaran = $this->service->storePengeluaran($validated);

        return response()->json([
            'success' => true, 
            'data' => new PengeluaranResource($pengeluaran)
        ], 201);
    }

    public function summary()
    {
        $summary = $this->service->getSummary();

        return response()->json([
            'success' => true,
            'data' => $summary
        ]);
    }
}