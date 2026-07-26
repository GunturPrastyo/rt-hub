<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penghuni extends Model
{
    use HasFactory;

    protected $table = 'penghuni'; 

    protected $guarded = ['id'];

    public function rumah()
    {
        return $this->hasMany(Rumah::class, 'penghuni_id');
    }
}