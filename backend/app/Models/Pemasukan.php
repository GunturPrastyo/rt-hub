<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemasukan extends Model
{
    protected $table = 'pemasukan';
    protected $guarded = ['id'];

    public function penghuni()
    {
        return $this->belongsTo(Penghuni::class, 'penghuni_id');
    }
    
    public function rumah()
    {
        return $this->belongsTo(Rumah::class, 'rumah_id');
    }
}