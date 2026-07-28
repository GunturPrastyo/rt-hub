<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; // <-- Tambahkan import ini untuk enkripsi password
use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken; 

class AuthController extends Controller
{
    /**
     * Register User Baru
     */
    public function register(Request $request)
    {
        // 1. Validasi input dari frontend
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users', // Pastikan email belum terdaftar
            'password' => 'required|string|min:8|confirmed', // Harus cocok dengan password_confirmation
        ]);

        // 2. Buat user baru ke database
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']), // Enkripsi password
        ]);

        // 3. Kembalikan response sukses
        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil. Silakan login.',
            'data'    => $user
        ], 201);
    }

    /**
     * Authenticate User (RT/Admin/Warga) & Return Sanctum Token
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            // Karena di kodinganmu menggunakan custom jsonResponse, pastikan metode itu ada di Controller utama (Base Controller).
            // Jika tidak ada, gunakan return response()->json(...) seperti pada fungsi register di atas.
            return $this->jsonResponse(
                success: false,
                message: 'Email atau password salah.',
                statusCode: 401
            );
        }

        /** @var User $user */ 
        $user = Auth::user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->respondWithToken($token, 'Login berhasil.', $user);
    }

    /**
     * Get Authenticated User Profile
     */
    public function me(Request $request)
    {
        return $this->jsonResponse(
            success: true,
            message: 'Data profil berhasil diambil.',
            data: $request->user()
        );
    }

    /**
     * Logout User & Invalidate Token
     */
    public function logout(Request $request)
    {
        /** @var User $user */ 
        $user = $request->user();

        /** @var PersonalAccessToken $token */ 
        $token = $user->currentAccessToken();
        
        $token->delete(); 

        return $this->jsonResponse(
            success: true,
            message: 'Berhasil logout.'
        );
    }

    /**
     * Format Response Token Sanctum
     */
    protected function respondWithToken(string $token, string $message, User $user) 
    {
        return response()->json([
            'success'      => true,
            'message'      => $message,
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ], 200);
    }
}