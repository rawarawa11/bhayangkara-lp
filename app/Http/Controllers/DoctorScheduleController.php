<?php

namespace App\Http\Controllers;

use App\Models\DoctorSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorScheduleController extends Controller
{
    public function index()
    {
        $schedules = DoctorSchedule::orderByRaw("FIELD(day, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')")
            ->orderBy('time_start')
            ->paginate(20);

        return Inertia::render('DoctorSchedules/Index', [
            'schedules' => $schedules
        ]);
    }

    public function create()
    {
        return Inertia::render('DoctorSchedules/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'doctor_name' => 'required|string|max:255',
            'specialist' => 'required|string|max:255',
            'day' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i|after:time_start',
            'is_available' => 'boolean',
        ]);

        DoctorSchedule::create($data);

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Jadwal dokter berhasil ditambahkan.');
    }

    public function edit(DoctorSchedule $schedule)
    {
        return Inertia::render('DoctorSchedules/Edit', [
            'schedule' => $schedule
        ]);
    }

    public function update(Request $request, DoctorSchedule $schedule)
    {
        $data = $request->validate([
            'doctor_name' => 'required|string|max:255',
            'specialist' => 'required|string|max:255',
            'day' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i|after:time_start',
            'is_available' => 'boolean',
        ]);

        $schedule->update($data);

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Jadwal dokter berhasil diperbarui.');
    }

    public function destroy(DoctorSchedule $schedule)
    {
        $schedule->delete();

        return redirect()->route('admin.schedules.index')
            ->with('success', 'Jadwal dokter berhasil dihapus.');
    }
}
