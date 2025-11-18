<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use Illuminate\Cache\RateLimiter;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(RegisterRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = User::create([
                'name' => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $token = $user->createToken('authToken')->plainTextToken;

            return $this->authResponse('user successfully registered', $user, $token, Response::HTTP_CREATED);

        } catch (\Exception $e) {
            // Log::error('registration error : ' . $e->getMessage());

            // return response()->json([
            //     'response_code' => Response::HTTP_INTERNAL_SERVER_ERROR,
            //     'status' => 'error',
            //     'message' => 'registration failed',
            // ], Response::HTTP_INTERNAL_SERVER_ERROR);

            return $this->execptionResponse($e, 'registration error', 'registration failed');
        }
    }

    /**
     * Login the user
     */
    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();

            if (!Auth::attempt($credentials)) {
                return response()->json([
                    'response_code' => Response::HTTP_UNAUTHORIZED,
                    'status' => 'error',
                    'message' => 'invalid credentials',
                ], Response::HTTP_UNAUTHORIZED);
            }

            $user = Auth::user();

            $token = $user->createToken('authToken')->plainTextToken;

            return $this->authResponse('login successful', $user,  $token);

        } catch (\Exception $e) {
            // Log::error('login error : ' . $e->getMessage());

            // return response()->json([
            //     'response_code' => Response::HTTP_INTERNAL_SERVER_ERROR,
            //     'status' => 'error',
            //     'message' => 'login failed',
            // ], Response::HTTP_INTERNAL_SERVER_ERROR);
            
            return $this->execptionResponse($e, 'login error', 'login failed');
        }
    }

    /**
     * Logout the authenticated user
     */
    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'response_code' => Response::HTTP_UNAUTHORIZED,
                    'status' => 'error',
                    'message' => 'user not authenticated'
                ], Response::HTTP_UNAUTHORIZED);
            }

            $user->currentAccessToken()->delete();

            return $this->authResponse('user successfully logged out');

        } catch (\Exception $e) {
            // Log::error('logout error : ' . $e->getMessage());

            // return response()->json([
            //     'response_code' => Response::HTTP_INTERNAL_SERVER_ERROR,
            //     'status' => 'error',
            //     'message' => 'an error occured during logout',
            // ], Response::HTTP_INTERNAL_SERVER_ERROR);

            return $this->execptionResponse($e, 'logout error', 'logout failed');
        }
    }

    /**
     * Handle forgot password request
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status !== Password::RESET_LINK_SENT) {
                return $this->errorResponse('Unable to send password reset link', Response::HTTP_BAD_REQUEST);
            }

            return $this->authResponse('Password reset link sent to your email address');
            
        } catch (\Exception $e) {
            return $this->execptionResponse($e, 'forgot password error', 'unable to process password reset request');
        }
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
            $throttleKey = 'reset-password:' . $request->email;
            $maxAttempts = 5;

            if (app(RateLimiter::class)->tooManyAttempts($key, $maxAttempts)) {
                return $this->errorResponse('Too many password reset attempts. Please try again later.', Response::HTTP_TOO_MANY_REQUESTS);
            };

            app(RateLimiter::class)->hit($throttleKey, 3600);

            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),

                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(60));

                    $user->save();
                }
            );

            if ($status !== Password::PASSWORD_RESET) {
                return $this->errorResponse('Invalid or expired reset token', Response::HTTP_BAD_REQUEST);
            }

            return $this->authResponse('Password has been reset successfully');

        } catch (\Exception $e) {
            return $this->execptionResponse($e, 'reset password error', 'unable to reset password');
        }
    }
    /**
     * Success response helper method
     */
    private function authResponse($message, $user = null, $token = null, $statusCode = Response::HTTP_OK)
    {
         $response = [
            'response_code' => $statusCode,
            'status' => 'success',
            'message' => $message,
        ];

        if ($user) {
            $response['user_info'] = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ];
        }

        if ($token) {
            $response['token'] = $token;
            $response['token_type'] = 'bearer';
            $response['expires_in'] = config('sanctum.expiration');
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Error response helper method
     */
    private function errorResponse($message, $statusCode)
    {
        return response()->json([
            'response_code' => $statusCode,
            'status' => 'error',
            'message' => $message,
        ], $statusCode);
    }

    /**
     * Exception response helper method
     */
    private function execptionResponse(Exception $e, $context, $message, $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR)
    {
        Log::error($context . ' : ' . $e->getMessage());

        return response()->json([
            'response_code' => $statusCode,
            'status' => 'error',
            'message' => $message,
        ], $statusCode);
    }
}
