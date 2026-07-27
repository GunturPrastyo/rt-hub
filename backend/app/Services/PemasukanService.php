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
                // If no current house or move-in date, assume no expected payments for simplicity
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
            
            // If move-in was in a previous year, start calculation from Jan of current year
            if ($tanggalMasuk->year < $currentYear) {
                $startMonthForCalculation = 1;
                $startYearForCalculation = $currentYear;
            }

            $expectedMonths = 0;
            if ($startYearForCalculation === $currentYear) {
                $expectedMonths = $currentMonth - $startMonthForCalculation + 1;
            } else {
                // This case should ideally not happen if we start from current year
                // If the resident moved in in a previous year, and we are calculating for the current year
                // Expected months are from Jan of current year to current month
                $expectedMonths = $currentMonth;
            }
            
            $expectedMonths = max(0, $expectedMonths); // Ensure expectedMonths is not negative

            $totalBulanKebersihanPaid = Pemasukan::where('penghuni_id', $warga->id)->sum('bulan_kebersihan');
            $totalBulanSatpamPaid = Pemasukan::where('penghuni_id', $warga->id)->sum('bulan_satpam');
            
            $tunggakanKebersihan = max(0, $expectedMonths - $totalBulanKebersihanPaid); 
            $tunggakanSatpam = max(0, $expectedMonths - $totalBulanSatpamPaid);

            return [
                'id' => $warga->id,
                'nama' => $warga->nama,
                'nomorRumah' => $nomorRumah,
                'statusWarga' => $warga->status_warga,
                'isKebersihanLunas' => $tunggakanKebersihan <= 0,
                'isSatpamLunas' => $tunggakanSatpam <= 0,
                'kebersihanStatus' => $tunggakanKebersihan <= 0 ? 'Lunas' : "Nunggak {$tunggakanKebersihan} Bulan",
                'satpamStatus' => $tunggakanSatpam <= 0 ? 'Lunas' : "Nunggak {$tunggakanSatpam} Bulan",
                'tunggakan' => [
                    'kebersihan' => $tunggakanKebersihan,
                    'satpam' => $tunggakanSatpam
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
}