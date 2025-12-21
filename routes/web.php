<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoctorScheduleController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\MedicineController;
use App\Models\Article;
use App\Models\DoctorSchedule;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\TrackVisitor;

Route::get('/', function () {
    $latest_articles = Article::published()->latest()->take(3)->get();

    $todays_schedules = DoctorSchedule::today()
        ->where('is_available', true)
        ->orderBy('time_start')
        ->take(6)
        ->get();

    return Inertia::render('Welcome', [
        'articles' => $latest_articles,
        'schedules' => $todays_schedules,
    ]);
})->middleware(TrackVisitor::class)->name('home');

Route::get('/artikel', [ArticleController::class, 'publicIndex'])->name('articles.public.index');
Route::get('/artikel/{slug}', [ArticleController::class, 'publicShow'])->name('articles.public.show');
Route::get('/jadwal-dokter', [DoctorScheduleController::class, 'publicList'])->name('schedules.public.list');

Route::middleware('guest')->group(function () {
    Route::get('masuk', [AuthController::class, 'showLogin'])->name('login');
    Route::post('masuk', [AuthController::class, 'login']);
    Route::get('daftar', [AuthController::class, 'showRegister'])->name('register');
    Route::post('daftar', [AuthController::class, 'register']);
});

Route::post('logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('articles', ArticleController::class);
        Route::post('/upload-image', [ArticleController::class, 'uploadEditorImage'])->name('upload-image');
        Route::patch('/medicines/{medicine}/toggle', [MedicineController::class, 'toggleAvailability'])->name('medicines.toggle-availability');
        Route::resource('medicines', MedicineController::class);
        Route::resource('knowledge', KnowledgeBaseController::class)
            ->only(['index', 'create', 'store', 'destroy']);
        Route::resource('schedules', DoctorScheduleController::class);

    });
