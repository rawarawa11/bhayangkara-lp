<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    //
    protected $fillable = [
        'name',
        'class',
        'capacity',
        'available',
        'is_bpjs',
        'created_by'
    ];

    protected $casts = [
        'is_bpjs' => 'boolean',
        'capacity' => 'integer',
        'available' => 'integer'
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
