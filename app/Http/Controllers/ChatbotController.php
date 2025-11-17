<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;

class ChatbotController extends Controller
{
    /**
     * Handle the incoming chat message
     */
    public function handle(Request $request)
    {
        $request->validate(['message' => 'required|string|max:500']);
        $userQuestion = $request->input('message');

        try {
            $embeddingResponse = OpenAI::embeddings()->create([
                'model' => 'text-embedding-ada-002',
                'input' => $userQuestion,
            ]);
            $questionVector = $embeddingResponse->embeddings[0]->embedding;
            $allNotes = KnowledgeBase::all();

            if ($allNotes->isEmpty()) {
                return response()->json(['reply' => 'Maaf, saya belum memiliki pengetahuan untuk menjawab itu.']);
            }

            $scores = [];
            foreach ($allNotes as $note) {
                $scores[$note->id] = $this->cosineSimilarity($questionVector, $note->embedding);
            }

            arsort($scores);
            $topNoteId = array_key_first($scores);
            $topScore = $scores[$topNoteId];

            $similarityThreshold = 0.75;

            if ($topScore < $similarityThreshold) {
                return response()->json(['reply' => 'Maaf, saya tidak yakin memiliki informasi yang relevan mengenai hal itu.']);
            }

            $context = $allNotes->find($topNoteId)->content;

            $systemPrompt = "You are a professional assistant for RS Bhayangkara Banda Aceh.
            You must answer the user's question based *only* on the context provided below.
            If the answer is not in the context, politely say 'Maaf, saya tidak memiliki informasi tersebut.'
            Answer in Indonesian.";

            $chatResponse = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => "Here is the only context you can use:\n\n" . $context],
                    ['role' => 'user', 'content' => "Here is the user's question:\n\n" . $userQuestion],
                ],
            ]);

            $botReply = $chatResponse->choices[0]->message->content;

            return response()->json(['reply' => $botReply]);

        } catch (\Exception $e) {
            return response()->json(['reply' => 'Maaf, sedang terjadi kesalahan pada sistem AI. ' . $e->getMessage()], 500);
        }
    }

    private function cosineSimilarity(array $a, array $b): float
    {
        $dotProduct = 0.0;
        $magA = 0.0;
        $magB = 0.0;

        $count = count($a);
        if ($count !== count($b)) {
            return 0.0;
        }

        for ($i = 0; $i < $count; $i++) {
            $dotProduct += $a[$i] * $b[$i];
            $magA += $a[$i] * $a[$i];
            $magB += $b[$i] * $b[$i];
        }

        $magA = sqrt($magA);
        $magB = sqrt($magB);

        if ($magA == 0.0 || $magB == 0.0) {
            return 0.0;
        }

        return $dotProduct / ($magA * $magB);
    }
}
