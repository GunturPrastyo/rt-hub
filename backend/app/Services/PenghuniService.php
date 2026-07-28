<?php

namespace App\Services;

use App\Models\Penghuni;
use Illuminate\Support\Facades\Storage;

class PenghuniService
{
    public function getAllPenghuni(?string $search, ?string $status)
    {
        $query = Penghuni::with('rumah')->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('telepon', 'like', "%{$search}%");
            });
        }

        if ($status && $status !== 'Semua') {
            $query->where('status_warga', $status);
        }

        return $query->paginate(9);
    }

    public function storePenghuni(array $data, $file = null)
    {
        if ($file) {
            $data['foto_ktp'] = $file->store('ktp', 'public');
        }
        return Penghuni::create($data);
    }

    public function updatePenghuni(Penghuni $penghuni, array $data, $file = null)
    {
        if ($file) {
            if ($penghuni->foto_ktp) {
                Storage::disk('public')->delete($penghuni->foto_ktp);
            }
            $data['foto_ktp'] = $file->store('ktp', 'public');
        }
        
        $penghuni->update($data);
        return $penghuni;
    }

    public function deletePenghuni(Penghuni $penghuni)
    {
        if ($penghuni->foto_ktp) {
            Storage::disk('public')->delete($penghuni->foto_ktp);
        }
        return $penghuni->delete();
    }
}