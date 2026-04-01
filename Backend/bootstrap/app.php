<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        // web: base_path('routes/web.php'),
        using: function () {
            Route::middleware('web')->group(base_path('routes/web.php'));

            $apiPath = base_path('routes/API');

            foreach (glob("$apiPath/V*/EntryPoint.php") as $file) {
                $versionPrefix = strtolower(basename(dirname($file)));
                Route::middleware('api')->prefix("api/$versionPrefix")->group($file);
            }
        },
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
            \App\Http\Middleware\ForceJsonResponse::class,
        ]);

        $middleware->api(append: [
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
    })->create();
