<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Article extends Model
{
    use HasFactory;

    protected $table = 'articles';
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'body',
        'image',
        'tags',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'status',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
        'views' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft')
            ->orWhereNull('published_at');
    }

    public function scopeScheduled(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '>', now());
    }

    public function getIsDraftAttribute(): bool
    {
        return is_null($this->published_at) || $this->status === 'draft';
    }

    public function getIsPublishedAttribute(): bool
    {
        return $this->published_at?->isPast() && $this->status === 'published';
    }

    public function getIsScheduledAttribute(): bool
    {
        return $this->published_at?->isFuture() && $this->status === 'published';
    }
}
