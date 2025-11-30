<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(): \Inertia\Response
    {
        $total = Article::all()->count();
        $drafts = Article::draft()->count();
        $published = Article::published()->count();
        $scheduled = Article::scheduled()->count();

        $publishedToday = Article::published()
            ->whereDate('published_at', now()->toDateString())
            ->count();

        $recent = Article::query()
            ->select(['id','title','slug','status','published_at','updated_at'])
            ->orderByDesc('updated_at')
            ->limit(10)
            ->get();

        $trend = Article::published()
            ->where('published_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(published_at) as day, COUNT(*) as count')
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        $topTags = Article::whereNotNull('tags')
            ->pluck('tags')
            ->flatMap(fn ($tags) => (array) $tags)
            ->countBy()
            ->sortDesc()
            ->take(10)
            ->map(fn ($count, $tag) => ['tag' => $tag, 'count' => $count])
            ->values();

        {
            return Inertia::render('Admin/Dashboard', [
                'total'          => Article::count(),
                'published'      => Article::published()->count(),
                'drafts'         => Article::draft()->count(),
                'scheduled'      => Article::scheduled()->count(),
                'publishedToday' => Article::published()->whereDate('published_at', today())->count(),
                'totalViews'     => (int) Article::sum('views'),
                'totalVisitors'  => Visitor::count(),
                'visitorsToday'  => Visitor::today()->count(),
                'popular'        => Article::published()
                    ->orderByDesc('views')
                    ->take(5)
                    ->get(['id', 'title', 'status', 'published_at', 'views']),
                'recent'         => Article::latest()->take(5)->get(),
                'topTags'        => [],
            ]);
        }
    }
}
