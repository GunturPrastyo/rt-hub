<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; 
use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken; 

class AuthController extends Controller
{
    /**
     * Register User Baru
     */
    public function register(Request $request)
    {  
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users', 
            'password' => 'required|string|min:8|confirmed', 
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']), 
        ]);

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