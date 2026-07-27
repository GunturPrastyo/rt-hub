<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rumah;
use App\Http\Resources\RumahResource;
use App\Services\RumahService;
use Illuminate\Http\Request;

class RumahController extends Controller
{
    public function __construct(protected RumahService $service) {}

    public function index()
    {
        
        return RumahResource::collection(Rumah::with('penghuni')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|unique:Rumah,nomor_rumah',
            'blok' => 'nullable|string',
            'status' => 'required|in:Dihuni,Kosong',
            'penghuni_id' => 'nullable|exists:Penghuni,id'
        ]);

        $rumah = $this->service->storeRumah($validated);
        
        return response()->json([
            'success' => true,
            'data' => new RumahResource($rumah)
        ], 201);
    }

    public function update(Request $request, Rumah $rumah)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|unique:Rumah,nomor_rumah,' . $rumah->id,
            'blok' => 'nullable|string',
            'status' => 'required|in:Dihuni,Kosong',
            'penghuni_id' => 'nullable|exists:Penghuni,id'
        ]);

        $rumah = $this->service->updateRumah($rumah, $validated);

        return response()->json([
            'success' => true,
            'data' => new RumahResource($rumah)
        ]);
    }

    public function destroy(Rumah $rumah)
    {
        $this->service->deleteRumah($rumah);
        
        return response()->json([
            'success' => true,
            'message' => 'Data rumah berhasil dihapus'
        ]);
    }
}