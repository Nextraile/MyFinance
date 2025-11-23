<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class RateLimiterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure middleware throttle uses our test-friendly limits by registering simple limiters here.
        // Individual tests override limiter definitions when they need different counts/windows.
    }

    public function test_login_rate_limiting_by_email_and_ip()
    {
        // Allow 3 attempts per minute for the same email+ip, then block
        RateLimiter::for('login', fn ($request) => Limit::perMinute(3)->by(
            strtolower((string) $request->input('email', '')) . '|' . $request->ip()
        ));

        $url = '/api/auth/login';
        $email = 'rate-test-login@example.test';

        // 3 attempts should not return 429 (likely 401 invalid credentials),
        // the 4th attempt should trigger 429
        for ($i = 1; $i <= 4; $i++) {
            $response = $this->postJson($url, ['email' => $email, 'password' => 'wrong-password']);
            if ($i < 4) {
                $this->assertTrue(in_array($response->getStatusCode(), [200, 401, 422, 404]), 'Unexpected status: '.$response->getStatusCode());
            } else {
                $response->assertStatus(429);
                $message = (string) ($response->json('message') ?? $response->getContent());
                $this->assertTrue(
                    stripos($message, 'too many') !== false,
                    'Throttle message not found. Got: '.$message
                );
            }
        }
    }

    public function test_forgot_password_rate_limiting_by_email()
    {
        // Rough equivalent of ~3 per 15min -> use 3 per minute for test speed
        RateLimiter::for('forgot-password', fn ($request) => Limit::perMinute(3)->by(
            strtolower((string) $request->input('email', ''))
        ));

        $url = '/api/auth/forgot-password';
        $email = 'rate-test-forgot@example.test';

        // First 3 requests should be processed (commonly return 200 regardless of existence).
        // 4th should be rate limited.
        for ($i = 1; $i <= 4; $i++) {
            $response = $this->postJson($url, ['email' => $email]);
            if ($i < 4) {
                $this->assertTrue(in_array($response->getStatusCode(), [200, 202, 422, 404]), 'Unexpected status: '.$response->getStatusCode());
            } else {
                $response->assertStatus(429);
            }
        }
    }

    public function test_reset_password_rate_limiting_by_token()
    {
        // Allow 2 attempts per minute per token for test, 3rd should be 429
        RateLimiter::for('reset-password', fn ($request) => Limit::perMinute(2)->by(
            substr((string) $request->input('token', ''), 0, 32) ?: 'reset-password-no-token'
        ));

        $url = '/api/auth/reset-password';
        $email = 'rate-test-reset@example.test';
        $dummyToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

        for ($i = 1; $i <= 3; $i++) {
            $response = $this->postJson($url, [
                'email' => $email,
                'token' => $dummyToken,
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ]);

            if ($i < 3) {
                // Expect failure due to invalid token or validation (422/400/etc.), but not 429 yet
                $this->assertTrue(in_array($response->getStatusCode(), [200, 400, 422, 404]), 'Unexpected status: '.$response->getStatusCode());
            } else {
                $response->assertStatus(429);
            }
        }
    }

    public function test_global_api_rate_limiter_falls_back_on_ip()
    {
        // Global fallback: allow 5 requests per minute per IP (test uses small number)
        RateLimiter::for('api', fn ($request) => Limit::perMinute(5)->by($request->ip()));

        $url = '/api/auth/register';

        // Create unique emails to avoid duplicate-email validation errors.
        for ($i = 1; $i <= 7; $i++) {
            $email = "rl_test_{$i}+" . uniqid() . "@example.test";
            $response = $this->postJson($url, [
                'name' => 'rl',
                'email' => $email,
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

            if ($i <= 5) {
                // Could be 201 or validation depending on exact implementation; ensure not 429
                $this->assertNotEquals(429, $response->getStatusCode());
            } else {
                // After limit exceeded expect 429
                $this->assertEquals(429, $response->getStatusCode());
                break;
            }
        }
    }
}