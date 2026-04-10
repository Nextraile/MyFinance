<?php

use App\Http\Controllers\API\V1\TrackerController;
use Illuminate\Support\Facades\Route;

Route::controller(TrackerController::class)->group(function () {
    Route::apiResource('trackers', TrackerController::class);
});
