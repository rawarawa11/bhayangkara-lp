<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OpenAI\Laravel\Facades\OpenAI;

class KnowledgeBaseController extends Controller
{
    public function index()
    {
        return Inertia::render('KnowledgeBase/Index', [
            'notes' => KnowledgeBase::select('id', 'content', 'created_at')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('KnowledgeBase/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'content' => 'required|string|min:30',
        ]);

        $content = $data['content'];

        try {
            $embeddingResponse = OpenAI::embeddings()->create([
                'model' => 'text-embedding-ada-002', // 1536 dimensions
                'input' => $content,
            ]);

            $embedding = $embeddingResponse->embeddings[0]->embedding;

            KnowledgeBase::create([
                'content' => $content,
                'embedding' => $embedding,
            ]);

        } catch (\Exception $e) {
            return back()->withErrors(['api_error' => 'Could not generate embedding: ' . $e->getMessage()]);
        }

        return redirect()->route('admin.knowledge.index')->with('success', 'Knowledge base entry created.');
    }

    public function destroy(KnowledgeBase $knowledge)
    {
        $knowledge->delete();
        return redirect()->route('admin.knowledge.index')->with('success', 'Knowledge base entry deleted.');
    }
}
