<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KategoriPengeluaranController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PemasukanController;
use App\Http\Controllers\Api\PengeluaranController;
use App\Http\Controllers\Api\PenghuniController;
use App\Http\Controllers\Api\RumahController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);  

/*
|--------------------------------------------------------------------------
| Protected Routes (Wajib Login dengan Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Route Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('penghuni', PenghuniController::class);
    Route::apiResource('rumah', RumahController::class);
    Route::get('/rumah/{rumah}', [RumahController::class, 'show']);
    Route::get('/rumah/{rumah}/history-penghuni', [RumahController::class, 'historyPenghuni']); // Infinite scroll penghuni
    Route::get('/rumah/{rumah}/history-pembayaran', [RumahController::class, 'historyPembayaran']); // Infinite scroll pembayaran
    Route::get('/summary', [PengeluaranController::class, 'summary']);
    Route::get('/pengeluaran', [PengeluaranController::class, 'index']);
    Route::post('/pengeluaran', [PengeluaranController::class, 'store']);
    Route::apiResource('kategori-pengeluaran', KategoriPengeluaranController::class)->except(['show']);
    Route::get('/iuran/status', [PemasukanController::class, 'statusIuran']);
    Route::post('/iuran', [PemasukanController::class, 'store']);
    Route::get('/tarif-master', [PemasukanController::class, 'getTarifMaster']);
    Route::post('/tarif-master', [PemasukanController::class, 'updateTarifMaster']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/laporan/export', [LaporanController::class, 'exportMutasi']);
    Route::get('/laporan/finansial', [LaporanController::class, 'finansial']);
});


