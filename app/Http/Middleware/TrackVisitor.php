<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cookie;
use App\Models\Visitor;

class TrackVisitor
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->hasCookie('visited_rs_bhayangkara')) {

            Visitor::create([
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'visit_date' => now()->toDateString(),
            ]);

            Cookie::queue('visited_rs_bhayangkara', 'true', 1440);
        }

        return $next($request);
    }
}
