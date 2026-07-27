<?php

namespace App\Services;

use App\Models\Pengeluaran;
use App\Services\PemasukanService;

class PengeluaranService
{
    protected $pemasukanService;

    public function __construct(PemasukanService $pemasukanService)
    {
        $this->pemasukanService = $pemasukanService;
    }

    public function getTotalPengeluaran()
    {
        return Pengeluaran::sum('nominal');
    }

    public function getSisaSaldo()
    {
        $totalPemasukan = $this->pemasukanService->getTotalPemasukan();
        $totalPengeluaran = $this->getTotalPengeluaran();

        return $totalPemasukan - $totalPengeluaran;
    }

    public function getAllPengeluaran()
    {
        return Pengeluaran::latest()->get();
    }

    public function storePengeluaran(array $data)
    {
        return Pengeluaran::create($data);
    }

    public function getSummary()
    {
        $totalPemasukan = $this->pemasukanService->getTotalPemasukan();
        $totalPengeluaran = $this->getTotalPengeluaran();

        return [
            'totalPemasukan' => (int) ($totalPemasukan ?? 0),
            'totalPengeluaran' => (int) ($totalPengeluaran ?? 0),
            'sisaSaldo' => (int) (($totalPemasukan ?? 0) - ($totalPengeluaran ?? 0)),
        ];
    }

    public function getTotalPengeluaranByMonthYear(int $month, int $year)
    {
        return Pengeluaran::whereYear('tanggal', $year)
                          ->whereMonth('tanggal', $month)
                          ->sum('nominal');
    }

    public function getMutasiPengeluaranByMonthYear(int $month, int $year)
    {
        return Pengeluaran::whereYear('tanggal', $year)
                          ->whereMonth('tanggal', $month)
                          ->orderBy('tanggal', 'desc')
                          ->get();
    }
}