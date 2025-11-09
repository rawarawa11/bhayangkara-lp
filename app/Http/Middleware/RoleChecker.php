<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class RoleChecker
{
    public function handle(Request $request, Closure $next, string ...$slugs)
    {
        $userSlug = $request->user()?->role?->slug;
        if (!$userSlug || (count($slugs) && !in_array($userSlug, $slugs, true))) {
            abort(403);
        }
        return $next($request);
    }
}
