<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penghuni;
use App\Http\Resources\PenghuniResource;
use App\Services\PenghuniService;
use Illuminate\Http\Request;

class PenghuniController extends Controller
{
    public function __construct(protected PenghuniService $service) {}

    public function index(Request $request)
    {
        $query = Penghuni::with('rumah')->latest();

        // Filter berdasarkan pencarian nama atau telepon
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('telepon', 'like', "%{$search}%");
            });
        }

        // Filter berdasarkan status warga (Tetap/Kontrak)
        if ($status = $request->query('status')) {
            if ($status !== 'Semua') {
                $query->where('status_warga', $status);
            }
        }

        // Gunakan paginate() dengan menampilkan 9 data per halaman (pas untuk desain grid 3 kolom)
        return PenghuniResource::collection($query->paginate(9));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'telepon' => 'required|string',
            'status_warga' => 'required|in:Tetap,Kontrak',
            'status_pernikahan' => 'required|in:Menikah,Belum Menikah',
            'foto_ktp' => 'nullable|image|max:2048'
        ]);

        $penghuni = $this->service->storePenghuni($validated, $request->file('foto_ktp'));

        return response()->json([
            'success' => true,
            'message' => 'Data penghuni berhasil ditambahkan.',
            'data' => new PenghuniResource($penghuni)
        ], 201);
    }

    public function update(Request $request, Penghuni $penghuni)
    {
        $validated = $request->validate([
            'nama' => 'required|string',
            'telepon' => 'required|string',
            'status_warga' => 'required|in:Tetap,Kontrak',
            'status_pernikahan' => 'required|in:Menikah,Belum Menikah',
            'foto_ktp' => 'nullable|image|max:2048'
        ]);

        $penghuni = $this->service->updatePenghuni($penghuni, $validated, $request->file('foto_ktp'));

        return response()->json([
            'success' => true,
            'message' => 'Data penghuni berhasil diperbarui.',
            'data' => new PenghuniResource($penghuni)
        ]);
    }

    public function destroy(Penghuni $penghuni)
    {
        $this->service->deletePenghuni($penghuni);

        return response()->json([
            'success' => true,
            'message' => 'Data penghuni berhasil dihapus.'
        ]);
    }
}
