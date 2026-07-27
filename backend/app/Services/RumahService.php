<?php

namespace App\Services;

use App\Models\Rumah;

class RumahService
{
    public function storeRumah(array $data)
    {
        return Rumah::create($data);
    }

    public function updateRumah(Rumah $rumah, array $data)
    {
        $rumah->update($data);
        return $rumah;
    }

    public function deleteRumah(Rumah $rumah)
    {
        return $rumah->delete();
    }
}