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
use Illuminate\Support\Facades\DB; 

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
        
        $selectedYear = $request->input('year', Carbon::now()->year);
        $selectedPeriode = $request->input('periode'); 

        $yearsPemasukan = Pemasukan::whereNotNull('tanggal_bayar')
            ->selectRaw('YEAR(tanggal_bayar) as year')
            ->distinct()
            ->pluck('year')
            ->toArray();

        $yearsPengeluaran = Pengeluaran::whereNotNull('tanggal')
            ->selectRaw('YEAR(tanggal) as year')
            ->distinct()
            ->pluck('year')
            ->toArray();

        $yearOptions = array_unique(array_merge($yearsPemasukan, $yearsPengeluaran));
        rsort($yearOptions);

        if (empty($yearOptions)) {
            $yearOptions = [Carbon::now()->year];
        }

        $grafik = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthName = Carbon::create()->month($i)->translatedFormat('M');

            $pemasukanBulanIni = $this->pemasukanService->getTotalPemasukanByMonthYear($i, $selectedYear);
            $pengeluaranBulanIni = $this->pengeluaranService->getTotalPengeluaranByMonthYear($i, $selectedYear);
            
            $grafik[] = [
                'bulan' => $monthName,
                'pemasukan' => (int) $pemasukanBulanIni,
                'pengeluaran' => (int) $pengeluaranBulanIni,
            ];
        }

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
                       
                        'created_at' => Carbon::parse($p->created_at)->toDateTimeString(),
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
                      
                        'created_at' => Carbon::parse($pe->created_at)->toDateTimeString(),
                        'tanggal' => Carbon::parse($pe->tanggal)->toDateString(),
                    ];
                }

                usort($allMutasi, function($a, $b) {
                    return strtotime($b['created_at']) - strtotime($a['created_at']);
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

        $periodeOptions = $this->getAvailableFinancialPeriods($selectedYear);

        return response()->json([
            'success' => true,
            'data' => [
                'grafik' => $grafik,
                'mutasi' => $paginatedMutasi,
                'periodeOptions' => $periodeOptions,
                'yearOptions' => $yearOptions, 
            ]
        ]);
    }

    private function getAvailableFinancialPeriods($year)
    {
        $pemasukanPeriods = Pemasukan::whereYear('tanggal_bayar', $year)
            ->selectRaw('DISTINCT DATE_FORMAT(tanggal_bayar, "%Y-%m") as periode')
            ->get()
            ->pluck('periode');

        $pengeluaranPeriods = Pengeluaran::whereYear('tanggal', $year)
            ->selectRaw('DISTINCT DATE_FORMAT(tanggal, "%Y-%m") as periode')
            ->get()
            ->pluck('periode');

        $allPeriods = $pemasukanPeriods->merge($pengeluaranPeriods)->unique()->sortDesc();

        return $allPeriods->map(function ($periode) {
            return Carbon::parse($periode . '-01')->translatedFormat('F Y');
        })->values()->toArray();
    }

    public function exportMutasi(Request $request)
    {
        $selectedYear = $request->input('year', Carbon::now()->year);
        $selectedPeriode = $request->input('periode'); 

        $allMutasi = [];
        $totalPemasukanBulanIni = 0;
        $totalPengeluaranBulanIni = 0;

        if ($selectedPeriode) {
            try {
                $carbonPeriode = Carbon::createFromFormat('F Y', $selectedPeriode);
                $month = $carbonPeriode->month;
                $year = $carbonPeriode->year;

                $pemasukanMutasi = $this->pemasukanService->getMutasiPemasukanByMonthYear($month, $year);
                $pengeluaranMutasi = $this->pengeluaranService->getMutasiPengeluaranByMonthYear($month, $year);

                foreach ($pemasukanMutasi as $p) {
                    $nominal = (int) $p->total;
                    $totalPemasukanBulanIni += $nominal; 
                    
                    $allMutasi[] = [
                        'tanggal' => Carbon::parse($p->tanggal_bayar)->format('Y-m-d'),
                        'jenis' => 'Pemasukan',
                        'kategori' => 'Iuran', 
                        'keterangan' => 'Pembayaran Iuran ' . $p->penghuni->nama . ' (' . $p->bulan_kebersihan . ' Kebersihan, ' . $p->bulan_satpam . ' Satpam)',
                        'nominal' => $nominal, 
                        'created_at' => Carbon::parse($p->created_at)->toDateTimeString(),
                    ];
                }

                foreach ($pengeluaranMutasi as $pe) {
                    $nominal = (int) $pe->nominal;
                    $totalPengeluaranBulanIni += $nominal; 
                    
                    $allMutasi[] = [
                        'tanggal' => Carbon::parse($pe->tanggal)->format('Y-m-d'),
                        'jenis' => 'Pengeluaran',
                        'kategori' => $pe->kategori,
                        'keterangan' => $pe->keterangan,
                        'nominal' => -$nominal, 
                        'created_at' => Carbon::parse($pe->created_at)->toDateTimeString(),
                    ];
                }

                usort($allMutasi, function($a, $b) {
                    return strtotime($b['created_at']) - strtotime($a['created_at']);
                });
            } catch (\Exception $e) {
                Log::error("Export Error: " . $e->getMessage());
            }
        }

        $sisaSaldoKas = $this->pengeluaranService->getSisaSaldo();

        $fileName = "Laporan_Mutasi_" . str_replace(' ', '_', $selectedPeriode) . ".csv";
        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['Tanggal', 'Jenis', 'Kategori', 'Keterangan', 'Nominal (Rp)'];

        $callback = function() use($allMutasi, $columns, $totalPemasukanBulanIni, $totalPengeluaranBulanIni, $sisaSaldoKas) {
            $file = fopen('php://output', 'w');
            
            fputs($file, chr(0xEF) . chr(0xBB) . chr(0xBF));
            
            fputcsv($file, $columns, ';');

            foreach ($allMutasi as $item) {
                fputcsv($file, [
                    $item['tanggal'],
                    $item['jenis'],
                    $item['kategori'],
                    $item['keterangan'],
                    $item['nominal'] 
                ], ';');
            }

            fputcsv($file, [], ';');
            fputcsv($file, [], ';');

            fputcsv($file, ['RINGKASAN PERIODE INI', '', '', '', ''], ';');
            fputcsv($file, ['Total Pemasukan Bulan Ini', '', '', '', $totalPemasukanBulanIni], ';');
            fputcsv($file, ['Total Pengeluaran Bulan Ini', '', '', '', -$totalPengeluaranBulanIni], ';');
            
            fputcsv($file, [], ';');
            
            fputcsv($file, ['TOTAL SALDO KAS RT (AKTUAL)', '', '', '', $sisaSaldoKas], ';');

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}