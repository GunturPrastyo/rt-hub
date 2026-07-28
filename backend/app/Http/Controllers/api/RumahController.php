<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RumahResource;
use App\Models\Rumah;
use App\Services\RumahService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RumahController extends Controller
{
    public function __construct(protected RumahService $service) {}

    public function index(Request $request)
    {
        $query = Rumah::with('penghuni')->latest();

        if ($search = $request->query('search')) {
            $query->where('nomor_rumah', 'like', "%{$search}%");
        }

        if ($status = $request->query('status')) {
            if ($status !== 'Semua') {
                $query->where('status', $status);
            }
        }

        return RumahResource::collection($query->paginate(9));
    }

    public function show(Rumah $rumah)
    {
        $rumah->load('penghuni');
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $rumah->id,
                'nomorRumah' => $rumah->nomor_rumah,
                'status' => $rumah->status,
                'penghuniNama' => $rumah->penghuni->nama ?? 'Tidak Ada (Kosong)'
            ]
        ]);
    }

    public function historyPenghuni(Rumah $rumah, Request $request)
    {
        $paginator = $this->service->getHistoryPenghuniPaginated($rumah, 5);

        $paginator->getCollection()->transform(function ($histori) {
            return [
                'id' => $histori->id,
                'nama' => $histori->penghuni->nama ?? 'Tidak Diketahui',
                'periodeMasuk' => Carbon::parse($histori->tanggal_masuk)->translatedFormat('d M Y'),
                'periodeKeluar' => $histori->tanggal_keluar ? Carbon::parse($histori->tanggal_keluar)->translatedFormat('d M Y') : null,
                'statusKontrak' => $histori->tanggal_keluar ? 'Selesai' : 'Aktif',
            ];
        });

        return response()->json($paginator);
    }

    public function historyPembayaran(Rumah $rumah, Request $request)
    {
        $paginator = $this->service->getHistoryPembayaranPaginated($rumah, 10);
        
        $paginator->getCollection()->transform(function ($pay) {
            // Buat rincian teks atau objek detail
            $rincianArray = [];
            if ($pay->bulan_kebersihan > 0) {
                $rincianArray[] = "Kebersihan ({$pay->bulan_kebersihan} bln)";
            }
            if ($pay->bulan_satpam > 0) {
                $rincianArray[] = "Satpam ({$pay->bulan_satpam} bln)";
            }

            return [
                'id' => $pay->id,
                'status' => 'Lunas', 
                'bulan' => Carbon::parse($pay->tanggal_bayar)->translatedFormat('d M Y'), 
                'penghuniSaatItu' => $pay->penghuni->nama ?? '-',
                'nominal' => $pay->total,
                'rincian' => implode(' • ', $rincianArray) 
            ];
        });

        return response()->json($paginator);
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
