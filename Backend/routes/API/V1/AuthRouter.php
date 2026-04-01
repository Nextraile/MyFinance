<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login')->name('login');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:forgot-password')->name('forgot-password');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:reset-password')->name('reset-password');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');
});