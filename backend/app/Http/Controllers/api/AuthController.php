<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken; // <-- Tambahkan import ini untuk Type Hint token

class AuthController extends Controller
{
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
            return $this->jsonResponse(
                success: false,
                message: 'Email atau password salah.',
                statusCode: 401
            );
        }

        /** @var User $user */ // <-- Disederhanakan menjadi 'User' saja
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
        /** @var User $user */ // <-- Disederhanakan menjadi 'User' saja
        $user = $request->user();

        /** @var PersonalAccessToken $token */ // <-- Memberitahu Intelephense bahwa ini adalah object Token
        $token = $user->currentAccessToken();
        
        $token->delete(); // Sekarang Intelephense tahu bahwa fungsi delete() ada!

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