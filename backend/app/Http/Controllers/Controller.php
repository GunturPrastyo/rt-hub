<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Helper untuk format response JSON yang konsisten di seluruh API.
     */
    protected function jsonResponse(bool $success, string $message, mixed $data = null, int $statusCode = 200)
    {
        $response = [
            'success' => $success,
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        return response()->json($response, $statusCode);
    }
}