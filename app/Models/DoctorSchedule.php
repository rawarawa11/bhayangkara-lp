<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class DoctorSchedule extends Model
{
    use HasFactory;
    protected $table = 'doctor_schedules';
    protected $fillable = [
        'doctor_name',
        'specialist',
        'day',
        'time_start',
        'time_end',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'time_start' => 'datetime:H:i',
        'time_end' => 'datetime:H:i',
    ];

    // Scope untuk memfilter berdasarkan hari ini
    public function scopeToday(Builder $query): Builder
    {
        $days = [
            'Sunday' => 'Minggu',
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
        ];

        $todayIndo = $days[date('l')] ?? 'Senin';
        return $query->where('day', $todayIndo);
    }
}
