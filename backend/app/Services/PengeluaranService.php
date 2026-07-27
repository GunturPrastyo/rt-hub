<?php

namespace App\Services;

use App\Models\Pengeluaran;
use App\Services\PemasukanService;
use Illuminate\Validation\ValidationException;

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
        $sisaSaldo = $this->getSisaSaldo();

        if ($data['nominal'] > $sisaSaldo) {
            throw ValidationException::withMessages([
                'nominal' => 'Gagal: Nominal pengeluaran melebihi sisa saldo kas saat ini (Sisa Saldo: Rp ' . number_format($sisaSaldo, 0, ',', '.') . ').'
            ]);
        }

        return Pengeluaran::create($data);
    }

    public function getTotalPengeluaranByYear(int $year)
    {
        return Pengeluaran::whereYear('tanggal', $year)->sum('nominal');
    }

    public function getSummary($year = null)
    {
        $totalPemasukanAll = $this->pemasukanService->getTotalPemasukan();
        $totalPengeluaranAll = $this->getTotalPengeluaran();
        $sisaSaldo = $totalPemasukanAll - $totalPengeluaranAll;

        if ($year) {
            $totalPemasukan = $this->pemasukanService->getTotalPemasukanByYear($year);
            $totalPengeluaran = $this->getTotalPengeluaranByYear($year);
        } else {
            $totalPemasukan = $totalPemasukanAll;
            $totalPengeluaran = $totalPengeluaranAll;
        }

        return [
            'totalPemasukan' => (int) ($totalPemasukan ?? 0),
            'totalPengeluaran' => (int) ($totalPengeluaran ?? 0),
            'sisaSaldo' => (int) ($sisaSaldo ?? 0),
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
