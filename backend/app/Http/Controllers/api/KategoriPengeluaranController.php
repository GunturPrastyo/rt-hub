<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\KategoriPengeluaran;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;

class KategoriPengeluaranController extends Controller {
    public function index() {
        return response()->json([
            'data' => KategoriPengeluaran::orderBy('nama', 'asc')->get()
        ]);
    }

    public function store(Request $request) {
        $request->validate(['nama' => 'required|string|unique:kategori_pengeluaran,nama']);
        $kategori = KategoriPengeluaran::create($request->only('nama'));
        return response()->json(['data' => $kategori], 201);
    }

    public function update(Request $request, KategoriPengeluaran $kategoriPengeluaran) {
        $request->validate(['nama' => 'required|string|unique:kategori_pengeluaran,nama,' . $kategoriPengeluaran->id]);
        $kategoriPengeluaran->update($request->only('nama'));
        return response()->json(['data' => $kategoriPengeluaran]);
    }

    public function destroy(KategoriPengeluaran $kategoriPengeluaran) {
        // Cek apakah kategori ini sudah dipakai di tabel pengeluaran (berdasarkan string nama)
        $isUsed = Pengeluaran::where('kategori', $kategoriPengeluaran->nama)->exists();
        
        if ($isUsed) {
            return response()->json(['message' => 'Gagal: Kategori sedang digunakan pada data pengeluaran!'], 400);
        }

        $kategoriPengeluaran->delete();
        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }
}