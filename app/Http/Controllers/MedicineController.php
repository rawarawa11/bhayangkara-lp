<?php

namespace App\Http\Controllers;

use App\Models\Medicine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;

class MedicineController extends Controller
{

    public function publicIndex(Request $request)
    {
        $q = trim((string) $request->get('q', ''));

        $medicines = Medicine::query()
            ->where('is_available', true)
            ->when($q !== '', function ($qb) use ($q) {
                $qb->where(function ($x) use ($q) {
                    $x->where('name', 'like', "%{$q}%")
                        ->orWhere('slug', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%");
                });
            })
            ->orderBy('name')
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Medicines/PublicIndex', [
            'medicines' => $medicines,
            'filters'   => compact('q'),
        ]);
    }

    public function index(Request $request)
    {
        $q      = trim((string) $request->get('q', ''));
        $avail  = $request->get('availability', 'all');
        $sort   = $request->get('sort', 'updated_desc');

        $query = Medicine::query()
            ->when($q !== '', function ($qb) use ($q) {
                $qb->where(function ($x) use ($q) {
                    $x->where('name', 'like', "%{$q}%")
                        ->orWhere('slug', 'like', "%{$q}%")
                        ->orWhere('description', 'like', "%{$q}%");
                });
            })
            ->when($avail === 'available', fn ($qb) => $qb->where('is_available', true))
            ->when($avail === 'unavailable', fn ($qb) => $qb->where('is_available', false))
            ->when($sort === 'name_asc', fn ($qb) => $qb->orderBy('name', 'asc'))
            ->when($sort === 'name_desc', fn ($qb) => $qb->orderBy('name', 'desc'))
            ->when($sort === 'updated_asc', fn ($qb) => $qb->orderBy('updated_at', 'asc'))
            ->when($sort === 'updated_desc', fn ($qb) => $qb->orderBy('updated_at', 'desc'));

        $medicines = $query->paginate(20)->withQueryString();

        return Inertia::render('Medicines/Index', [
            'medicines' => $medicines,
            'filters'   => compact('q', 'avail', 'sort'),
        ]);
    }


    public function create()
    {
        return Inertia::render('Medicines/Create');
    }

    public function store(Request $request)
    {
        $data = $this->validatePayload($request);

        // slug
        $data['slug'] = $this->makeUniqueSlug($data['slug'] ?? $data['name']);

        // image
        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'), $data['slug']);
        }

        $medicine = Medicine::create($data);

        return redirect()
            ->route('medicines.edit', $medicine)
            ->with('success', 'Obat berhasil dibuat.')
            ->setStatusCode(303);
    }


    public function edit(Medicine $medicine)
    {
        return Inertia::render('Medicines/Edit', ['medicine' => $medicine]);
    }

    public function update(Request $request, Medicine $medicine)
    {
        $data = $this->validatePayload($request, $medicine->id);

        if (array_key_exists('slug', $data)) {
            $data['slug'] = $this->makeUniqueSlug(
                blank($data['slug']) ? $medicine->name : $data['slug'],
                $medicine->id
            );
        }

        if ($request->hasFile('image')) {
            $this->deleteImageIfExists($medicine->image);
            $data['image'] = $this->storeImage($request->file('image'), $data['slug'] ?? $medicine->slug);
        }

        $medicine->update($data);

        return redirect()
            ->route('medicines.edit', $medicine)
            ->with('success', 'Obat berhasil diperbarui.')
            ->setStatusCode(303);
    }


    public function destroy(Medicine $medicine)
    {
        $this->deleteImageIfExists($medicine->image);
        $medicine->delete();

        return redirect()
            ->route('medicines.index')
            ->with('success', 'Obat berhasil dihapus.')
            ->setStatusCode(303);
    }

    public function toggleAvailability(Medicine $medicine): RedirectResponse
    {
        $medicine->is_available = ! $medicine->is_available;
        $medicine->save();

        return back()->with('success', 'Ketersediaan obat diperbarui.');
    }

    protected function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'slug'         => ['nullable', 'string', 'max:255', Rule::unique('medicines', 'slug')->ignore($ignoreId)],
            'description'  => ['nullable', 'string'],
            'image'        => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:4096'],
            'is_available' => ['required', 'boolean'],
        ]);
    }

    protected function makeUniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = Str::slug($base);
        $original = $slug;
        $i = 2;

        while (
        Medicine::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }

    protected function storeImage(UploadedFile $file, string $slug): string
    {
        $ext  = $file->getClientOriginalExtension() ?: $file->extension();
        $name = $slug . '-' . time() . '.' . $ext;
        return $file->storeAs('medicines', $name, 'public');
    }

    protected function deleteImageIfExists(?string $path): void
    {
        if (! $path) return;

        $normalized = preg_replace('#^/?storage/#', '', $path);
        if (Storage::disk('public')->exists($normalized)) {
            Storage::disk('public')->delete($normalized);
        }
    }
}
