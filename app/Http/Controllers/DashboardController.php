<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $total          = Article::count();
        $drafts         = Article::draft()->count();
        $published      = Article::published()->count();
        $scheduled      = Article::scheduled()->count();
        $totalViews     = (int) Article::sum('views');
        $totalVisitors  = Visitor::count();
        $visitorsToday  = Visitor::today()->count();

        $endDate = now();
        $startDate = now()->subDays(29);

        $visitorsData = Visitor::selectRaw('DATE(visit_date) as date, COUNT(*) as count')
            ->whereBetween('visit_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->groupBy('date')
            ->pluck('count', 'date');

        $articlesData = Article::published()
            ->whereBetween('published_at', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->selectRaw('DATE(published_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $chartData = collect();
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $dateString = $date->format('Y-m-d');
            $chartData->push([
                'name'      => $date->format('d M'), // e.g., "12 Oct"
                'visitors'  => $visitorsData[$dateString] ?? 0,
                'articles'  => $articlesData[$dateString] ?? 0,
            ]);
        }

        $topTags = Article::whereNotNull('tags')
            ->published()
            ->pluck('tags')
            ->flatMap(function ($tags) {
                return is_array($tags) ? $tags : [];
            })
            ->countBy()
            ->sortDesc()
            ->take(8)
            ->map(fn ($count, $tag) => ['tag' => $tag, 'count' => $count])
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'total'          => $total,
            'published'      => $published,
            'drafts'         => $drafts,
            'scheduled'      => $scheduled,
            'totalViews'     => $totalViews,
            'totalVisitors'  => $totalVisitors,
            'visitorsToday'  => $visitorsToday,

            'popular'        => Article::published()
                ->orderByDesc('views')
                ->take(5)
                ->get(['id', 'title', 'views', 'status', 'published_at']),

            'recent'         => Article::latest()
                ->take(5)
                ->get(['id', 'title', 'status', 'published_at', 'views']),

            'topTags'        => $topTags,
            'chartData'      => $chartData,
        ]);
    }
}
