<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DoctorScheduleController;
use App\Http\Controllers\KnowledgeBaseController;
use App\Http\Controllers\MedicineController;
use App\Models\Article;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\TrackVisitor;

Route::get('/', function () {
    $latest_articles = Article::published()->latest()->take(3)->get();
    return Inertia::render('Welcome', [
        'articles' => $latest_articles
    ]);
})->middleware(TrackVisitor::class)->name('home');

Route::middleware('guest')->group(function () {
    Route::get('masuk', [AuthController::class, 'showLogin'])->name('login');
    Route::post('masuk', [AuthController::class, 'login']);
    Route::get('daftar', [AuthController::class, 'showRegister'])->name('register');
    Route::post('daftar', [AuthController::class, 'register']);
});

Route::middleware(['auth','role:admin'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/admin/artikel/manajemen', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/admin/artikel/buat', [ArticleController::class, 'create'])->name('articles.create');
    Route::get('/admin/artikel/edit/{article}', [ArticleController::class, 'edit'])->name('articles.edit');
    Route::post('/admin/artikel', [ArticleController::class, 'store'])->name('articles.store');
    Route::put('/admin/artikel/{article}', [ArticleController::class, 'update'])->name('articles.update');
    Route::delete('/admin/artikel/{article}', [ArticleController::class, 'destroy'])->name('articles.destroy');
    Route::get('/admin/obat/manajemen', [MedicineController::class, 'index'])->name('medicines.index');
    Route::get('/admin/obat/create', [MedicineController::class, 'create'])->name('medicines.create');
    Route::post('/admin/obat', [MedicineController::class, 'store'])->name('medicines.store');
    Route::get('/admin/obat/{medicine}/edit', [MedicineController::class, 'edit'])->name('medicines.edit');
    Route::put('/admin/obat/{medicine}', [MedicineController::class, 'update'])->name('medicines.update');
    Route::delete('/admin/obat/{medicine}', [MedicineController::class, 'destroy'])->name('medicines.destroy');
    Route::patch('/medicines/{medicine}/toggle', [MedicineController::class, 'toggleAvailability'])->name('medicines.toggle-availability');
    Route::resource('knowledge', KnowledgeBaseController::class)->only(['index', 'create', 'store', 'destroy']);
    Route::resource('schedules', DoctorScheduleController::class)
        ->names([
            'index' => 'schedules.index',
            'create' => 'schedules.create',
            'store' => 'schedules.store',
            'edit' => 'schedules.edit',
            'update' => 'schedules.update',
            'destroy' => 'schedules.destroy',
        ]);

});

Route::post('logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/artikel', [ArticleController::class, 'PublicIndex'])->name('articles.public.index');
Route::get('/artikel/{slug}', [ArticleController::class, 'publicShow'])->name('articles.public.show');

