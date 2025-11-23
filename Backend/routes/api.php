<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TrackerController;
use App\Http\Controllers\TransactionController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:api')->name('register');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login')->name('login');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:forgot-password')->name('forgot-password');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:reset-password')->name('reset-password');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('throttle:api')->name('logout');
    });

    Route::apiResource('trackers', TrackerController::class)->middleware('throttle:api');
    Route::apiResource('transactions', TransactionController::class)->middleware('throttle:api');

    Route::get('search/trackers', [TrackerController::class, 'search'])->middleware('throttle:api');
    Route::get('search/transactions', [TransactionController::class, 'search'])->middleware('throttle:api');
});

Route::fallback(function () {
    return response()->json([
        'response_code' => 404,
        'status' => 'error',
        'message' => 'API endpoint not found'
    ], 404);
});