<?php

namespace App\Http\Controllers;

use App\Models\Article;
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

//use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ArticleController extends Controller
{
    public function PublicIndex(Request $request) {
        $q = trim((string) $request->get('q',''));
        $sort = $request->get('sort','published_at_desc');

        $articles = Article::query()
            ->published()
            ->when($q !== '', function ($qBuilder) use ($q) {
                $qBuilder->where(function ($x) use ($q) {
                    $x->where('title', 'LIKE', '%' . $q . '%')
                        ->orWhere('tags', 'LIKE', '%' . $q . '%')
                        ->orWhere('body', 'LIKE', '%' . $q . '%');
                });
            })
            ->when($sort === 'published_at_desc', fn ($qb) => $qb->orderBy('published_at', 'desc') )
            ->when($sort === 'published_at_asc', fn ($qb) => $qb->orderBy('published_at', 'asc') )
            ->when($sort === 'title_asc', fn ($qb) => $qb->orderBy('title', 'asc'))
            ->when($sort === 'title_desc', fn ($qb) => $qb->orderBy('title', 'desc'))
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Articles/Index', ['articles' => $articles, 'filters' => compact('q','sort')]);
//        return response()->json($articles);
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
//            ->route('articles.edit', $article)
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
        $data = $this->validatePayload($request, $article->id);

        if (array_key_exists('slug', $data)) {
            $data['slug'] = $this->makeUniqueSlug(
                blank($data['slug']) ? $article->title : $data['slug'],
                true,
                $article->id
            );
        }

        if ($request->hasFile('image')) {
            $this->deleteImageIfExists($article->image);
            $data['image'] = $this->storeImage($request->file('image'), $data['slug'] ?? $article->slug);
        }

        $article->update($data);

        return back()->with('success', 'Article updated.');
    }

    public function destroy(Article $article): RedirectResponse|Redirector
    {
        $article->delete();
        return redirect()->route('articles.index')->with(['success' => 'Artikel berhasil dihapus.']);
    }


    protected function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'user_id'           => ['nullable', 'exists:users,id'],
            'title'             => ['required', 'string', 'max:255'],
            'slug'              => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('articles', 'slug')->ignore($ignoreId),
            ],
            'body'              => ['nullable', 'string'],
            'image'             => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:4096'],
            'tags'              => ['nullable', 'array'],
            'tags.*'            => ['nullable'],
            'meta_title'        => ['nullable', 'string', 'max:255'],
            'meta_description'  => ['nullable', 'string', 'max:500'],
            'meta_keywords'     => ['nullable', 'string', 'max:500'],
            'status'            => ['required', Rule::in(['draft', 'published'])],
            'published_at'      => ['nullable', 'date'],
        ]);
    }


    protected function makeUniqueSlug(string $base, bool $treatAsSlug = false, ?int $ignoreId = null): string
    {
        $slug = $treatAsSlug ? Str::slug($base): Str::slug($base);
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

    protected function deleteImageIfExists(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
