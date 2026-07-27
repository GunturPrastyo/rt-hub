<?php

namespace App\Services;

use App\Models\Pemasukan;
use App\Models\HistoriPenghuni;
use App\Models\Penghuni;
use Carbon\Carbon;

class PemasukanService
{
    public function calculateStatusIuran()
    {   
        $currentDate = Carbon::now();
        $currentMonth = $currentDate->month;
        $currentYear = $currentDate->year;

        $penghunis = Penghuni::whereHas('currentRumah')->with('currentRumah')->get();

        return $penghunis->map(function ($warga) use ($currentMonth, $currentYear) {
            $nomorRumah = '-';
            $tanggalMasuk = null;

            if ($warga->currentRumah) {
                $nomorRumah = $warga->currentRumah->nomor_rumah;
                $histori = HistoriPenghuni::where('rumah_id', $warga->currentRumah->id)
                                          ->where('penghuni_id', $warga->id)
                                          ->whereNull('tanggal_keluar')
                                          ->first();
                if ($histori) {
                    $tanggalMasuk = Carbon::parse($histori->tanggal_masuk);
                }
            }

            if (!$tanggalMasuk) {
                return [
                    'id' => $warga->id,
                    'nama' => $warga->nama,
                    'nomorRumah' => $nomorRumah,
                    'statusWarga' => $warga->status_warga,
                    'isKebersihanLunas' => true,
                    'isSatpamLunas' => true,
                    'kebersihanStatus' => 'Tidak Ada Data Masuk',
                    'satpamStatus' => 'Tidak Ada Data Masuk',
                    'tunggakan' => ['kebersihan' => 0, 'satpam' => 0]
                ];
            }
            
            $startMonthForCalculation = max($tanggalMasuk->month, 1);
            $startYearForCalculation = $tanggalMasuk->year;
            
            if ($tanggalMasuk->year < $currentYear) {
                $startMonthForCalculation = 1;
                $startYearForCalculation = $currentYear;
            }

            $expectedMonths = 0;
            if ($startYearForCalculation === $currentYear) {
                $expectedMonths = $currentMonth - $startMonthForCalculation + 1;
            } else {
                $expectedMonths = $currentMonth;
            }
            
            $expectedMonths = max(0, $expectedMonths); 

            $totalBulanKebersihanPaid = Pemasukan::where('penghuni_id', $warga->id)->sum('bulan_kebersihan');
            $totalBulanSatpamPaid = Pemasukan::where('penghuni_id', $warga->id)->sum('bulan_satpam');
            
            // LOGIKA BARU: Menghitung selisih pembayaran
            $selisihKebersihan = $totalBulanKebersihanPaid - $expectedMonths;
            $selisihSatpam = $totalBulanSatpamPaid - $expectedMonths;

            // Penentuan Status Iuran Kebersihan
            if ($selisihKebersihan < 0) {
                $statusKeb = "Nunggak " . abs($selisihKebersihan) . " Bulan";
                $isKebLunas = false;
                $tunggakanKeb = abs($selisihKebersihan);
            } elseif ($selisihKebersihan == 0) {
                $statusKeb = "Lunas";
                $isKebLunas = true;
                $tunggakanKeb = 0;
            } else {
                $statusKeb = "Lunas (Lebih {$selisihKebersihan} Bulan)";
                $isKebLunas = true;
                $tunggakanKeb = 0;
            }

            // Penentuan Status Iuran Satpam
            if ($selisihSatpam < 0) {
                $statusSat = "Nunggak " . abs($selisihSatpam) . " Bulan";
                $isSatLunas = false;
                $tunggakanSat = abs($selisihSatpam);
            } elseif ($selisihSatpam == 0) {
                $statusSat = "Lunas";
                $isSatLunas = true;
                $tunggakanSat = 0;
            } else {
                $statusSat = "Lunas (Lebih {$selisihSatpam} Bulan)";
                $isSatLunas = true;
                $tunggakanSat = 0;
            }

            return [
                'id' => $warga->id,
                'nama' => $warga->nama,
                'nomorRumah' => $nomorRumah,
                'statusWarga' => $warga->status_warga,
                'isKebersihanLunas' => $isKebLunas,
                'isSatpamLunas' => $isSatLunas,
                'kebersihanStatus' => $statusKeb,
                'satpamStatus' => $statusSat,
                'tunggakan' => [
                    'kebersihan' => $tunggakanKeb,
                    'satpam' => $tunggakanSat
                ]
            ];
        });
    }

    public function storePemasukan(array $data)
    {
        $total = ($data['bulanKebersihan'] * 35000) + ($data['bulanSatpam'] * 80000);

        return Pemasukan::create([
            'penghuni_id' => $data['penghuniId'],
            'bulan_kebersihan' => $data['bulanKebersihan'],
            'bulan_satpam' => $data['bulanSatpam'],
            'total' => $total,
            'tanggal_bayar' => Carbon::now()->toDateString()
        ]);
    }

    public function getTotalPemasukan()
    {
        return Pemasukan::sum('total');
    }

    public function getTotalPemasukanByYear(int $year)
    {
        return Pemasukan::whereYear('tanggal_bayar', $year)->sum('total');
    }

    public function getTotalPemasukanByMonthYear(int $month, int $year)
    {
        return Pemasukan::whereYear('tanggal_bayar', $year)
                        ->whereMonth('tanggal_bayar', $month)
                        ->sum('total');
    }

    public function getMutasiPemasukanByMonthYear(int $month, int $year)
    {
        return Pemasukan::with('penghuni')
                        ->whereYear('tanggal_bayar', $year)
                        ->whereMonth('tanggal_bayar', $month)
                        ->orderBy('tanggal_bayar', 'desc')
                        ->get();
    }
}