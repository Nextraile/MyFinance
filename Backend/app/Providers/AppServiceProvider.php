<?php

namespace App\Providers;

use App\Helpers\ResponseHelper;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Global API limiter (fallback)
        RateLimiter::for('api', function ($request) {
            return [
                // Up to 120 requests per minute
                Limit::perMinute(120)->by($request->user()?->id ?: $request->ip())
                ->response(function () {
                    return ResponseHelper::errorResponse('Too many requests. Please try again later.', 429);
                }),
            ];
        });

        // Login limiter (per email + IP)
        RateLimiter::for('login', function ($request) {
            $emailKey = strtolower((string)$request->input('email', '')) ?: 'login-no-email';
            return [
                // Up to 5 login attempts per minute per email+IP
                Limit::perMinute(5)->by($emailKey.'|'.$request->ip())
                ->response(function () {
                    return ResponseHelper::errorResponse('Too many login attempts. Please try again later.', 429);
                }),

                // Up to 20 login attempts per minute per IP
                Limit::perMinute(20)->by('login-ip:'.$request->ip())
                ->response(function () {
                    return ResponseHelper::errorResponse('IP rate limit exceeded. Please try again later.', 429);
                }),
            ];
        });

        // Forgot password limiter: per email (whether registered or not) + IP
        RateLimiter::for('forgot-password', function ($request) {
            $emailKey = strtolower((string) $request->input('email', '')) ?: 'forgot-password-no-email';
            return [
                // Up to 3 requests per 15 minutes per email (whether registered or not, to prevent enumeration)
                Limit::perMinutes(15, 3)->by($emailKey)
                    ->response(fn () => ResponseHelper::errorResponse('Too many password reset requests for this email. Please try again later.', 429)),

                // Up to 30 requests per hour per email+IP
                Limit::perHour(30)->by('forgot-password-email-ip:'. $emailKey.'|'.$request->ip())
                    ->response(fn () => ResponseHelper::errorResponse('Too many password reset requests from this email and IP. Please try again later.', 429)),
            ];
        });

        // Reset password (token usage) limiter
        RateLimiter::for('reset-password', function ($request) {
            $tokenKey = substr((string) $request->input('token'), 0, 32) ?: 'reset-password-no-token';
            return [
                // Up to 5 requests per 10 minutes per token (regardless of validity)
                Limit::perMinutes(10, 5)->by($tokenKey)
                    ->response(fn () => ResponseHelper::errorResponse('Too many attempts with this token. Please try again later.', 429)),

                // Up to 50 requests per hour per IP
                Limit::perHour(50)->by('reset-password-ip:'.$request->ip())
                    ->response(fn () => ResponseHelper::errorResponse('Too many reset attempts from this IP. Please try again later.', 429)),
            ];
        });
    }
};