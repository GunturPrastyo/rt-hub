<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Penghuni;
use App\Models\Rumah;
use App\Models\HistoriPenghuni;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'rt@gmail.com'], 
            [
                'name'     => 'Pak RT Administrator',
                'password' => Hash::make('password123'),
                'role'     => 'admin',
            ]
        );

        $namaPenghuni = [
            'Budi Santoso', 'Siti Aminah', 'Andi Pratama', 'Dewi Lestari', 'Rahmat Hidayat',
            'Joko Susilo', 'Sri Wahyuni', 'Arif Rahman', 'Nina Safitri', 'Hendra Gunawan',
            'Maya Indah', 'Dedi Kusuma', 'Rina Marlina', 'Faisal Akbar', 'Eka Putri',
            'Gilang Ramadhan', 'Fitriani', 'Aditya Nugraha', 'Ratna Sari', 'Reza Pahlevi'
        ];

        $penghuniIds = [];

        foreach ($namaPenghuni as $index => $nama) {
            $penghuni = Penghuni::firstOrCreate(
                ['telepon' => '0812000000' . str_pad($index + 1, 2, '0', STR_PAD_LEFT)],
                [
                    'nama' => $nama,
                    'status_warga' => ($index % 4 == 0) ? 'Kontrak' : 'Tetap', 
                    'status_pernikahan' => ($index % 3 == 0) ? 'Belum Menikah' : 'Menikah',
                ]
            );
            $penghuniIds[] = $penghuni->id;
        }

        for ($i = 1; $i <= 20; $i++) {
            $nomorRumah = 'A-' . str_pad($i, 2, '0', STR_PAD_LEFT);
            
            if ($i <= 15) {
                $rumah = Rumah::firstOrCreate(
                    ['nomor_rumah' => $nomorRumah],
                    [
                        'blok' => 'Blok A',
                        'status' => 'Dihuni',
                        'penghuni_id' => $penghuniIds[$i - 1]
                    ]
                );

                HistoriPenghuni::firstOrCreate([
                    'rumah_id' => $rumah->id,
                    'penghuni_id' => $penghuniIds[$i - 1],
                ], [
                    'tanggal_masuk' => Carbon::now()->subMonths(rand(1, 12))->format('Y-m-d'),
                ]);
            } else {
                Rumah::firstOrCreate(
                    ['nomor_rumah' => $nomorRumah],
                    [
                        'blok' => 'Blok A',
                        'status' => 'Kosong',
                        'penghuni_id' => null
                    ]
                );
            }
        }
    }
}