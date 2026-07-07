<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));

        $query = Doctor::query()
            ->when($q, function ($query, $q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('name', 'like', "%{$q}%")
                        ->orWhere('specialist', 'like', "%{$q}%");
                });
            });

        $doctors = $query->orderBy('name')->paginate(20)->withQueryString();

        return Inertia::render('Doctors/Index', [
            'doctors' => $doctors,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Doctors/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'specialist' => 'required|string|max:255',
        ]);

        $data['created_by'] = auth()->id();
        Doctor::create($data);

        return redirect()->route('doctors.index')
            ->with('success', 'Dokter berhasil ditambahkan.');
    }

    public function edit(Doctor $doctor)
    {
        return Inertia::render('Doctors/Edit', [
            'doctor' => $doctor
        ]);
    }

    public function update(Request $request, Doctor $doctor)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'specialist' => 'required|string|max:255',
        ]);

        $doctor->update($data);

        return redirect()->route('doctors.index')
            ->with('success', 'Dokter berhasil diperbarui.');
    }

    public function destroy(Doctor $doctor)
    {
        $doctor->delete();

        return redirect()->route('doctors.index')
            ->with('success', 'Dokter berhasil dihapus.');
    }
}
