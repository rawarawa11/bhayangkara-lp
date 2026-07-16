<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));

        $query = Room::query()
            ->when($q, function ($query, $q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('name', 'like', "%{$q}%")
                        ->orWhere('class', 'like', "%{$q}%");
                });
            });

        $rooms = $query->orderBy('class')->orderBy('name')->paginate(20)->withQueryString();

        return Inertia::render('Rooms/Index', [
            'rooms' => $rooms,
            'filters' => ['q' => $q],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'class' => 'required|string|max:255',
            'capacity' => 'required|integer|min:0',
            'available' => 'required|integer|min:0|lte:capacity',
            'is_bpjs' => 'required|boolean',
        ]);

        $data['created_by'] = auth()->id();
        Room::create($data);

        return redirect()->route('rooms.index')
            ->with('success', 'Kamar berhasil ditambahkan.');
    }

    public function update(Request $request, Room $room)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'class' => 'required|string|max:255',
            'capacity' => 'required|integer|min:0',
            'available' => 'required|integer|min:0|lte:capacity',
            'is_bpjs' => 'required|boolean',
        ]);

        $room->update($data);

        return redirect()->route('rooms.index')
            ->with('success', 'Kamar berhasil diperbarui.');
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return redirect()->route('rooms.index')
            ->with('success', 'Kamar berhasil dihapus.');
    }
}
