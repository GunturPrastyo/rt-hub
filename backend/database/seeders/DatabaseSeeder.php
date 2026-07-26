<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
       
        User::updateOrCreate(
            ['email' => 'rt@gmail.com'], 
            [
                'name'     => 'Pak RT Administrator',
                'password' => Hash::make('password123'),
                'role'     => 'admin',
            ]
        );
    }
}