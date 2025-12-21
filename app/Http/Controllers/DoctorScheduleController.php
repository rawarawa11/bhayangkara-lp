<?php

namespace App\Http\Controllers;

use App\Models\DoctorSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DoctorScheduleController extends Controller
{
    public function publicList(): Response
    {
        $schedules = DoctorSchedule::where('is_available', true)
            ->orderBy('time_start')
            ->get();

        return Inertia::render('DoctorSchedules/PublicIndex', [
            'schedules' => $schedules
        ]);
    }

    public function index(Request $request)
    {
        $is_available = $request->get('is_available', 'all');
        $q = trim((string) $request->get('q', ''));
        // $sort = $request->get('sort', 'updated_desc');

        $query = DoctorSchedule::query()
            ->when($q, function ($query, $q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('doctor_name', 'like', "%{$q}%")
                        ->orWhere('specialist', 'like', "%{$q}%")
                        ->orWhere('day', 'like', "%{$q}%");
                });
            })
            ->when($is_available !== 'all', function ($query) use ($is_available) {
                $query->where('is_available', $is_available === 'available');
            });

        $schedules = $query->orderByRaw("CASE day
                WHEN 'Senin' THEN 1
                WHEN 'Selasa' THEN 2
                WHEN 'Rabu' THEN 3
                WHEN 'Kamis' THEN 4
                WHEN 'Jumat' THEN 5
                WHEN 'Sabtu' THEN 6
                WHEN 'Minggu' THEN 7
                ELSE 8 END")
            ->orderBy('time_start')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('DoctorSchedules/Index', [
            'schedules' => $schedules,
            'filters' => [
                'q' => $q,
                'is_available' => $is_available
            ],
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

        return redirect()->route('schedules.index')
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

        return redirect()->route('schedules.index')
            ->with('success', 'Jadwal dokter berhasil diperbarui.');
    }

    public function destroy(DoctorSchedule $schedule)
    {
        $schedule->delete();

        return redirect()->route('schedules.index')
            ->with('success', 'Jadwal dokter berhasil dihapus.');
    }
}
