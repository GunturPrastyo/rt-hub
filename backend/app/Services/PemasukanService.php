<?php

namespace App\Services;

use App\Models\Pemasukan;
use App\Models\HistoriPenghuni;
use App\Models\Penghuni;
use Carbon\Carbon;

class PemasukanService
{
    public function calculateStatusIuran($perPage = 10, $search = null)
    {
        $currentDate = Carbon::now();
        $currentMonth = $currentDate->month;
        $currentYear = $currentDate->year;

        // Gunakan Query Builder untuk pencarian
        $query = Penghuni::whereHas('currentRumah')->with('currentRumah');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhereHas('currentRumah', function ($qr) use ($search) {
                        $qr->where('nomor_rumah', 'like', "%{$search}%");
                    });
            });
        }

        // Terapkan Pagination
        $penghunis = $query->paginate($perPage);

        // Transformasi item di dalam koleksi paginasi
        $penghunis->getCollection()->transform(function ($warga) use ($currentMonth, $currentYear) {
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

            $selisihKebersihan = $totalBulanKebersihanPaid - $expectedMonths;
            $selisihSatpam = $totalBulanSatpamPaid - $expectedMonths;

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

        // Kembalikan objek Paginator
        return $penghunis;
    }

    public function storePemasukan(array $data)
    {
        $total = ($data['bulanKebersihan'] * 35000) + ($data['bulanSatpam'] * 80000);

        // Cari tahu warga ini sekarang tinggal di rumah mana
        $penghuni = Penghuni::with('currentRumah')->find($data['penghuniId']);
        $rumahId = $penghuni->currentRumah->id ?? null;

        return Pemasukan::create([
            'penghuni_id' => $data['penghuniId'],
            'rumah_id' => $rumahId, // Simpan rumah_id ke database
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
