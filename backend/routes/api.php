<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Authenticated RT/Admin)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    
});