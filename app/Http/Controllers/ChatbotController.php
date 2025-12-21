<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use Gemini;
use Throwable;

class ChatbotController extends Controller
{
    /**
     * Handle the incoming chat message.
     */
    public function handle(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|min:1|max:500',
        ]);

        $userQuestion = $validated['message'];
        $context = null;

        try {
            $apiKey = env('GEMINI_API_KEY');
            if (empty($apiKey)) {
                throw new \Exception('GEMINI_API_KEY is not set in .env file.');
            }

            $client = Gemini::client($apiKey);

            $allNotes = KnowledgeBase::all();

            if (!$allNotes->isEmpty()) {
                $embeddingResponse = $client->embeddingModel('text-embedding-004')
                    ->embedContent($userQuestion);
                $questionVector = $embeddingResponse->embedding->values;

                $bestMatch = $this->findBestMatch($questionVector, $allNotes);

                $similarityThreshold = 0.75;
                if ($bestMatch && $bestMatch['score'] >= $similarityThreshold) {
                    $context = $bestMatch['note']->content;
                }
            }
            $systemPrompt = $this->createSystemPrompt($context);

            $finalPrompt = $this->buildFinalPrompt($systemPrompt, $userQuestion, $context);
            $response = $client->generativeModel(model: 'gemini-2.0-flash')
                ->generateContent($finalPrompt);

            return response()->json(['reply' => $response->text()]);

        } catch (Throwable $e) {
            report($e);
            return response()->json(['reply' => 'Maaf, terjadi kesalahan pada sistem AI kami. Silakan coba lagi nanti.'], 500);
        }
    }

    /**
     * Creates a dynamic system prompt based on whether context is available.
     */
    private function createSystemPrompt(?string $context): string
    {
        $basePrompt = "Anda adalah Asisten Virtual AI dari RS Bhayangkara Banda Aceh.
        Sapa pengguna dengan ramah (misalnya 'Halo!' atau 'Tentu, saya bantu').
        Jawablah dalam bahasa Indonesia yang profesional, sopan, dan empatik.
        Identitas Anda adalah asisten, bukan dokter. Jangan pernah memberikan diagnosis medis.
        Anda boleh menjawab pertanyaan umum tentang kesehatan (seperti 'apa itu demam?').";

        if ($context) {
            $ragInstruction = "PENTING: Untuk pertanyaan berikut, Anda HARUS menjawab HANYA berdasarkan konteks yang diberikan.
            Jangan tambahkan informasi di luar konteks.
            Jika jawaban tidak ada di dalam konteks, katakan 'Maaf, saya tidak memiliki informasi spesifik mengenai hal itu.'";

            return $basePrompt . "\n\n" . $ragInstruction;
        } else {
            $generalInstruction = "Anda akan menjawab pertanyaan umum dari pengguna.
            Jika pengguna menanyakan informasi spesifik tentang RS Bhayangkara (seperti jadwal dokter tertentu, biaya, atau nomor antrian) yang Anda tidak tahu, katakan dengan sopan:
            'Untuk informasi spesifik seperti itu, saya sarankan untuk menghubungi resepsionis kami di (0651) 123-456 atau datang langsung ke rumah sakit.'";

            return $basePrompt . "\n\n" . $generalInstruction;
        }
    }

    /**
     * Builds the final string to send to the Gemini API.
     */
    private function buildFinalPrompt(string $systemPrompt, string $userQuestion, ?string $context): string
    {
        if ($context) {
            return $systemPrompt . "\n\n" .
                "--- KONTEKS (GUNAKAN INI) ---:\n" . $context . "\n\n" .
                "--- PERTANYAAN PENGGUNA ---:\n" . $userQuestion . "\n\n" .
                "--- JAWABAN (HANYA DARI KONTEKS) ---:\n";
        } else {
            return $systemPrompt . "\n\n" .
                "--- PERTANYAAN PENGGUNA ---:\n" . $userQuestion . "\n\n" .
                "--- JAWABAN ---:\n";
        }
    }

    /**
     * Finds the best matching note from the collection.
     */
    private function findBestMatch(array $questionVector, $allNotes): ?array
    {
        $bestScore = -1.0;
        $bestNote = null;

        foreach ($allNotes as $note) {
            if (empty($note->embedding) || !is_array($note->embedding)) {
                continue;
            }

            $score = $this->cosineSimilarity($questionVector, $note->embedding);

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestNote = $note;
            }
        }

        if ($bestNote === null) {
            return null;
        }

        return ['note' => $bestNote, 'score' => $bestScore];
    }

    /**
     * Calculates the Cosine Similarity between two vectors.
     */
    private function cosineSimilarity(array $a, array $b): float
    {
        $dotProduct = 0.0;
        $magA = 0.0;
        $magB = 0.0;

        $count = count($a);
        if ($count === 0 || $count !== count($b)) {
            return 0.0;
        }

        for ($i = 0; $i < $count; $i++) {
            $dotProduct += ($a[$i] ?? 0) * ($b[$i] ?? 0);
            $magA += ($a[$i] ?? 0) ** 2;
            $magB += ($b[$i] ?? 0) ** 2;
        }

        $magA = sqrt($magA);
        $magB = sqrt($magB);

        if ($magA == 0.0 || $magB == 0.0) {
            return 0.0;
        }

        return $dotProduct / ($magA * $magB);
    }
}
