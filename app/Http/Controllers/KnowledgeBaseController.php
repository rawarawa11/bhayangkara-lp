<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Gemini;
use Throwable;

class KnowledgeBaseController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q'));

        $notes = KnowledgeBase::query()
            ->when($q, function ($query, $q) {
                $query->where('content', 'like', "%{$q}%");
            })
            ->select('id', 'content', 'created_at')
            ->latest()
            ->get();

        return Inertia::render('KnowledgeBase/Index', [
            'notes' => $notes,
            'filters' => compact('q'),
        ]);
    }

    public function create()
    {
        return Inertia::render('KnowledgeBase/Create');
    }

    public function edit(KnowledgeBase $knowledge)
    {
        return Inertia::render('KnowledgeBase/Edit', [
            'note' => $knowledge,
        ]);
    }

    public function update(Request $request, KnowledgeBase $knowledge)
    {
        $data = $request->validate([
            'content' => 'required|string|min:30',
        ]);

        $content = $data['content'];

        try {
            $apiKey = env('GEMINI_API_KEY');
            if (empty($apiKey)) {
                throw new \Exception('GEMINI_API_KEY is not set in .env file.');
            }

            $client = Gemini::client($apiKey);

            $response = $client->embeddingModel('gemini-embedding-2')
                ->embedContent($content);

            $knowledge->update([
                'content'   => $content,
                'embedding' => $response->embedding->values,
            ]);

        } catch (Throwable $e) {
            report($e);
            return back()->withErrors(['api_error' => 'Could not regenerate embedding: ' . $e->getMessage()]);
        }

        return redirect()->route('knowledge.index')->with('success', 'Knowledge base entry updated.');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string|min:30',
        ]);

        $content = $data['content'];

        try {
            $apiKey = env('GEMINI_API_KEY');
            if (empty($apiKey)) {
                throw new \Exception('GEMINI_API_KEY is not set in .env file.');
            }

            $client = Gemini::client($apiKey);

            $response = $client->embeddingModel('gemini-embedding-2')
                ->embedContent($content);

            $embedding = $response->embedding->values;

            KnowledgeBase::create([
                'content' => $content,
                'embedding' => $embedding,
            ]);

        } catch (Throwable $e) {
            report($e);
            return back()->withErrors(['api_error' => 'Could not generate embedding: ' . $e->getMessage()]);
        }

        return redirect()->route('knowledge.index')->with('success', 'Knowledge base entry created.');
    }

    public function destroy(KnowledgeBase $knowledge)
    {
        $knowledge->delete();
        return redirect()->route('knowledge.index')->with('success', 'Knowledge base entry deleted.');
    }
}
