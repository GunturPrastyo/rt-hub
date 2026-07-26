<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\JWTGuard;

class AuthController extends Controller
{
    /**
     * Helper untuk mendapatkan JWT Guard dengan Type Hinting untuk IDE/Intelephense
     */
    private function guard(): JWTGuard
    {
        /** @var JWTGuard $guard */
        $guard = Auth::guard('api');
        return $guard;
    }

    /**
     * Authenticate User (RT/Admin) & Return JWT Token
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (! $token = $this->guard()->attempt($credentials)) {
            return $this->jsonResponse(
                success: false,
                message: 'Email atau password salah.',
                statusCode: 401
            );
        }

        return $this->respondWithToken($token, 'Login berhasil.');
    }

    /**
     * Get Authenticated User Profile
     */
    public function me()
    {
        return $this->jsonResponse(
            success: true,
            message: 'Data profil berhasil diambil.',
            data: $this->guard()->user()
        );
    }

    /**
     * Logout User & Invalidate Token
     */
    public function logout()
    {
        $this->guard()->logout();

        return $this->jsonResponse(
            success: true,
            message: 'Berhasil logout.'
        );
    }

    /**
     * Refresh JWT Token
     */
    public function refresh()
    {
        return $this->respondWithToken($this->guard()->refresh(), 'Token berhasil diperbarui.');
    }

    /**
     * Format Response Token JWT
     */
    protected function respondWithToken(string $token, string $message)
    {
        return response()->json([
            'success'      => true,
            'message'      => $message,
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => $this->guard()->factory()->getTTL() * 60,
            'user'         => $this->guard()->user(),
        ], 200);
    }
}