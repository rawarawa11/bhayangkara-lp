<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;

class Visitor extends Model
{
    use HasFactory;
    protected $fillable = ['ip_address', 'user_agent', 'visit_date'];
    public function scopeToday(Builder $query): Builder
    {
        return $query->where('visit_date', now()->toDateString());
    }
}
