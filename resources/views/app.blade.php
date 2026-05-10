<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Critical resource hints --}}
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.bunny.net">

    {{-- Preload LCP hero image (largest contentful paint element on homepage) --}}
    <link rel="preload" as="image" href="/images/rs-gambar.webp" type="image/webp" fetchpriority="high">

    {{-- Non-render-blocking font: load as stylesheet only after parse, then swap --}}
    <link rel="preload" as="style" href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap"
          onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet">
    </noscript>

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
@inertia
</body>
</html>
