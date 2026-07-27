<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pemasukan;
use App\Models\Pengeluaran;
use App\Services\PemasukanService;
use App\Services\PengeluaranService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class LaporanController extends Controller
{
    protected $pemasukanService;
    protected $pengeluaranService;

    public function __construct(PemasukanService $pemasukanService, PengeluaranService $pengeluaranService)
    {
        $this->pemasukanService = $pemasukanService;
        $this->pengeluaranService = $pengeluaranService;
    }

    public function finansial(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = 10; 
        $currentYear = Carbon::now()->year;
        $selectedPeriode = $request->input('periode'); 

        // 1. Grafik Data (Yearly)
        $grafik = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthName = Carbon::create()->month($i)->translatedFormat('M');
            $pemasukanBulanIni = $this->pemasukanService->getTotalPemasukanByMonthYear($i, $currentYear);
            $pengeluaranBulanIni = $this->pengeluaranService->getTotalPengeluaranByMonthYear($i, $currentYear);
            $grafik[] = [
                'bulan' => $monthName,
                'pemasukan' => (int) $pemasukanBulanIni,
                'pengeluaran' => (int) $pengeluaranBulanIni,
            ];
        }

        // 2. Mutasi Data (Monthly based on selectedPeriode)
        $allMutasi = [];
        if ($selectedPeriode) {
            try {
                $carbonPeriode = Carbon::createFromFormat('F Y', $selectedPeriode);
                $month = $carbonPeriode->month;
                $year = $carbonPeriode->year;

                $pemasukanMutasi = $this->pemasukanService->getMutasiPemasukanByMonthYear($month, $year);
                $pengeluaranMutasi = $this->pengeluaranService->getMutasiPengeluaranByMonthYear($month, $year);

                foreach ($pemasukanMutasi as $p) {
                    $allMutasi[] = [
                        'id' => 'pemasukan-' . $p->id, 
                        'jenis' => 'Pemasukan',
                        'kategori' => 'Iuran', 
                        'keterangan' => 'Pembayaran Iuran ' . $p->penghuni->nama . ' (' . $p->bulan_kebersihan . ' Kebersihan, ' . $p->bulan_satpam . ' Satpam)',
                        'nominal' => (int) $p->total,
                        'tanggal' => Carbon::parse($p->tanggal_bayar)->toDateString(),
                    ];
                }

                foreach ($pengeluaranMutasi as $pe) {
                    $allMutasi[] = [
                        'id' => 'pengeluaran-' . $pe->id, 
                        'jenis' => 'Pengeluaran',
                        'kategori' => $pe->kategori,
                        'keterangan' => $pe->keterangan,
                        'nominal' => (int) $pe->nominal,
                        'tanggal' => Carbon::parse($pe->tanggal)->toDateString(),
                    ];
                }

                usort($allMutasi, function($a, $b) {
                    return strtotime($b['tanggal']) - strtotime($a['tanggal']);
                });
            } catch (\Exception $e) {
                Log::error("Invalid periode format received: " . $selectedPeriode . " Error: " . $e->getMessage());
            }
        }

        $collection = collect($allMutasi);
        $paginatedMutasi = new LengthAwarePaginator(
            $collection->forPage($page, $perPage)->values(),
            $collection->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        $periodeOptions = $this->getAvailableFinancialPeriods();

        return response()->json([
            'success' => true,
            'data' => [
                'grafik' => $grafik,
                'mutasi' => $paginatedMutasi,
                'periodeOptions' => $periodeOptions,
            ]
        ]);
    }

    private function getAvailableFinancialPeriods()
    {
        $pemasukanPeriods = Pemasukan::selectRaw('DISTINCT DATE_FORMAT(tanggal_bayar, "%Y-%m") as periode')->get()->pluck('periode');
        $pengeluaranPeriods = Pengeluaran::selectRaw('DISTINCT DATE_FORMAT(tanggal, "%Y-%m") as periode')->get()->pluck('periode');

        $allPeriods = $pemasukanPeriods->merge($pengeluaranPeriods)->unique()->sortDesc();

        return $allPeriods->map(function ($periode) {
            return Carbon::parse($periode . '-01')->translatedFormat('F Y');
        })->values()->toArray();
    }
}