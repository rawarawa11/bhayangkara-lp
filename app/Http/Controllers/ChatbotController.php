<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeBase;
use App\Models\DoctorSchedule;
use App\Models\Medicine;
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
        $ragContext = null;

        try {
            $apiKey = env('GEMINI_API_KEY');
            if (empty($apiKey)) {
                throw new \Exception('GEMINI_API_KEY is not set in .env file.');
            }

            $client = Gemini::client($apiKey);

            $allNotes = KnowledgeBase::all();

            if (!$allNotes->isEmpty()) {
                $embeddingResponse = $client->embeddingModel('gemini-embedding-2')
                    ->embedContent($userQuestion);
                $questionVector = $embeddingResponse->embedding->values;

                $bestMatch = $this->findBestMatch($questionVector, $allNotes);

                $similarityThreshold = 0.75;
                if ($bestMatch && $bestMatch['score'] >= $similarityThreshold) {
                    $ragContext = $bestMatch['note']->content;
                }
            }
            
            $systemPrompt = $this->createSystemPrompt($ragContext);

            // Use the native systemInstruction API to prevent prompt injection
            $response = $client->generativeModel(model: 'gemini-2.5-flash')
                ->withSystemInstruction(\Gemini\Data\Content::parse($systemPrompt))
                ->generateContent($userQuestion);

            return response()->json(['reply' => $response->text()]);

        } catch (Throwable $e) {
            report($e);
            return response()->json(['reply' => 'Maaf, terjadi kesalahan pada sistem AI kami. Silakan coba lagi nanti.'], 500);
        }
    }

    private function getPublicHospitalDataContext(): string
    {
        $medicines = Medicine::where('is_available', true)
            ->select('name', 'description')
            ->get()
            ->toArray();

        $schedules = DoctorSchedule::with(['doctor' => function ($query) {
                $query->select('id', 'name', 'specialist');
            }])
            ->where('is_available', true)
            ->select('doctor_id', 'day', 'time_start', 'time_end')
            ->get()
            ->toArray();
        
        $context = "DATA RUMAH SAKIT SAAT INI:\n\n";
        
        $context .= "DAFTAR OBAT YANG TERSEDIA:\n";
        if (empty($medicines)) {
            $context .= "- Belum ada data obat.\n";
        } else {
            foreach ($medicines as $med) {
                $context .= "- {$med['name']}: {$med['description']}\n";
            }
        }

        $context .= "\nJADWAL DOKTER:\n";
        if (empty($schedules)) {
            $context .= "- Belum ada jadwal dokter.\n";
        } else {
            foreach ($schedules as $sched) {
                $doctorName = $sched['doctor']['name'] ?? 'Dokter Tidak Diketahui';
                $specialist = $sched['doctor']['specialist'] ?? 'Umum';
                $timeStart = substr($sched['time_start'], 0, 5);
                $timeEnd = substr($sched['time_end'], 0, 5);
                $context .= "- {$doctorName} ({$specialist}) praktik pada hari {$sched['day']} pukul {$timeStart} - {$timeEnd}.\n";
            }
        }

        return $context;
    }

    private function createSystemPrompt(?string $ragContext): string
    {
        $basePrompt = "Anda adalah Asisten Virtual AI dari RS Bhayangkara Banda Aceh.
        Sapa pengguna dengan ramah (misalnya 'Halo!' atau 'Tentu, saya bantu').
        Jawablah dalam bahasa Indonesia yang profesional, sopan, dan empatik.
        Identitas Anda adalah asisten, bukan dokter. Jangan pernah memberikan diagnosis medis.
        Anda akan diberikan Data Rumah Sakit (seperti daftar obat dan jadwal dokter) serta Konteks Tambahan.
        Gunakan data tersebut untuk menjawab pertanyaan pengguna.
        Jika pengguna menanyakan informasi spesifik yang tidak ada dalam data atau konteks (seperti biaya perawatan spesifik atau ketersediaan kamar), katakan dengan sopan bahwa Anda tidak memiliki informasi tersebut dan sarankan untuk menghubungi resepsionis kami di (0651) 123-456 atau datang langsung ke rumah sakit.";

        $hospitalData = $this->getPublicHospitalDataContext();

        $fullPrompt = $basePrompt . "\n\n" . "=== DATA STRUKTURAL (JADWAL & OBAT) ===\n" . $hospitalData;

        if ($ragContext) {
            $fullPrompt .= "\n\n=== KONTEKS TAMBAHAN DARI KNOWLEDGE BASE ===\n" . $ragContext;
        }

        return $fullPrompt;
    }


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
