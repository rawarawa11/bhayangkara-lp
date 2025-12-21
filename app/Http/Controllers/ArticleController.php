<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Inertia\Response;
use Illuminate\Support\Facades\Cookie;

class ArticleController extends Controller
{
    // ... publicIndex and publicShow methods (keep them as is) ...

    public function publicIndex(Request $request)
    {
        $q = trim((string) $request->get('q'));
        $sort = $request->get('sort', 'published_at_desc');

        $query = Article::published()
            ->with('user:id,name')
            ->when($q, function (Builder $qb, $search) {
                $qb->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('body', 'like', "%{$search}%")
                        ->orWhere('tags', 'like', "%{$search}%");
                });
            });

        $query = match ($sort) {
            'published_at_asc' => $query->orderBy('published_at', 'asc'),
            'title_asc'        => $query->orderBy('title', 'asc'),
            'title_desc'       => $query->orderBy('title', 'desc'),
            default            => $query->orderBy('published_at', 'desc'),
        };

        $articles = $query->paginate(12)->withQueryString();

        return Inertia::render('Articles/PublicIndex', [
            'articles' => $articles,
            'filters' => compact('q', 'sort'),
        ]);
    }

    public function publicShow(string $slug)
    {
        $article = Article::with('user')
            ->where('slug', $slug)
            ->firstOrFail();

        abort_unless($article->is_published, 404);

        $recommendedArticles = Article::published()
            ->where('id', '!=', $article->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        $cookieName = 'viewed_article_' . $article->id;
        if (!Cookie::get($cookieName)) {
            $article->increment('views');
            Cookie::queue($cookieName, 'true', 1440);
        }

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'recommendedArticles' => $recommendedArticles,
        ]);
    }

    public function index(Request $request) {
        $status = $request->get('status');
        $q = trim((string) $request->get('q',''));
        $sort = $request->get('sort','updated_desc');

        $query = Article::query()
            ->when($status === 'draft', fn ($qb) => $qb->draft())
            ->when($status === 'scheduled', fn ($qb) => $qb->scheduled())
            ->when($status === 'published', fn ($qb) => $qb->published())
            ->when($q !== '', function ($qb) use ($q) {
                $qb->where(function ($x) use ($q) {
                    $x->where('title', 'like', "%{$q}%")
                        ->orWhere('slug', 'like', "%{$q}%")
                        ->orWhere('meta_title', 'like', "%{$q}%")
                        ->orWhere('meta_description', 'like', "%{$q}%");
                });
            })
            ->when($sort === 'updated_asc', fn ($qb) => $qb->orderBy('updated_at', 'asc'))
            ->when($sort === 'updated_desc', fn ($qb) => $qb->orderBy('updated_at', 'desc'))
            ->when($sort === 'title_asc', fn ($qb) => $qb->orderBy('title', 'asc'))
            ->when($sort === 'title_desc', fn ($qb) => $qb->orderBy('title', 'desc'));

        $articles = $query->paginate(20)->withQueryString();
        return Inertia::render('Articles/Index', ['articles' => $articles]);
    }

    public function create(): Response
    {
        return Inertia::render('Articles/Create', [
            'article' => [
                'title' => '',
                'slug' => '',
                'body' => '',
                'image' => null,
                'tags' => [],
                'meta_title' => '',
                'meta_description' => '',
                'meta_keywords' => '',
                'status' => 'draft',
                'published_at' => null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validatePayload($request);

        $data['slug'] = blank($data['slug'] ?? null)
            ? $this->makeUniqueSlug($data['title'])
            : $this->makeUniqueSlug($data['slug'], true);

        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'), $data['slug']);
        }

        $data['user_id'] = $data['user_id'] ?? auth()->id();
        $article = Article::create($data);

        return redirect()
            ->route('articles.index')
            ->with('success', 'Artikel berhasil dibuat.')
            ->setStatusCode(303);
    }

    public function edit(Article $article)
    {
        return Inertia::render('Articles/Edit', [
            'article' => $article
        ]);
    }

    public function update(Request $request, Article $article)
    {
        // 1. Validate
        $data = $this->validatePayload($request, $article->id);

        // 2. Handle Slug Update (only if changed)
        if (array_key_exists('slug', $data) && $data['slug'] !== $article->slug) {
            $data['slug'] = $this->makeUniqueSlug(
                blank($data['slug']) ? $data['title'] : $data['slug'],
                true,
                $article->id
            );
        } else {
            unset($data['slug']);
        }

        if ($request->hasFile('image')) {
            $this->deleteImageIfExists($article->image);
            $data['image'] = $this->storeImage($request->file('image'), $data['slug'] ?? $article->slug);
        } else {
            unset($data['image']);
        }
        $article->update($data);

        return redirect()->route('articles.index')
            ->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        // 1. Delete the "Featured Image" (The main cover)
        $this->deleteImageIfExists($article->image);

        // 2. Delete images embedded inside the Body (Tiptap content)
        $this->deleteEditorImages($article->body);

        $article->delete();

        return redirect()->route('admin.articles.index')
            ->with(['success' => 'Artikel berhasil dihapus.']);
    }

    /**
     * Helper to parse HTML and delete local images found inside.
     */
    protected function deleteEditorImages(?string $htmlContent): void
    {
        if (empty($htmlContent)) return;

        // Use DOMDocument to parse the HTML string
        $dom = new \DOMDocument();
        // The @ suppresses warnings for malformed HTML fragments
        @$dom->loadHTML($htmlContent, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $images = $dom->getElementsByTagName('img');

        foreach ($images as $img) {
            $src = $img->getAttribute('src');

            // Only delete if the image is hosted on OUR server (contains 'storage/uploads/editor')
            if (strpos($src, '/storage/uploads/editor') !== false) {

                // Convert URL to relative path for Storage facade
                // Example: http://site.test/storage/uploads/editor/abc.jpg -> uploads/editor/abc.jpg
                $path = str_replace(asset('storage') . '/', '', $src);

                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }
    }

    protected function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        $rules = [
            'user_id'           => ['nullable', 'exists:users,id'],
            'title'             => ['required', 'string', 'max:255'],
            'slug'              => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('articles', 'slug')->ignore($ignoreId),
            ],
            'body'              => ['nullable', 'string'],
            'tags'              => ['nullable', 'array'],
            'tags.*'            => ['nullable'],
            'meta_title'        => ['nullable', 'string', 'max:255'],
            'meta_description'  => ['nullable', 'string', 'max:500'],
            'meta_keywords'     => ['nullable', 'string', 'max:500'],
            'status'            => ['required', Rule::in(['draft', 'published'])],
            'published_at'      => ['nullable', 'date'],
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = ['image', 'mimes:jpg,jpeg,png,webp,avif', 'max:4096'];
        } else {
            $rules['image'] = ['nullable'];
        }

        return $request->validate($rules);
    }

    protected function makeUniqueSlug(string $base, bool $treatAsSlug = false, ?int $ignoreId = null): string
    {
        $slug = $treatAsSlug ? Str::slug($base) : Str::slug($base);
        $original = $slug;
        $i = 2;

        while (
        Article::where('slug', $slug)
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
        $ext = $file->getClientOriginalExtension() ?: $file->extension();
        $name = $slug . '-' . time() . '.' . $ext;
        $path = $file->storeAs('articles', $name, 'public');
        return $path;
    }

    public function uploadEditorImage(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpg,jpeg,png,webp,gif|max:2048', // Max 2MB
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('uploads/editor', 'public');
            return response()->json([
                'url' => asset('storage/' . $path)
            ]);
        }

        return response()->json(['error' => 'Upload failed'], 400);
    }

    protected function deleteImageIfExists(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
