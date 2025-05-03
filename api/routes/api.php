<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TwitterController;
use App\Http\Controllers\Api\TwitchController;
use App\Http\Controllers\Api\InteressesController;
use App\Http\Controllers\Api\AtividadesController;
use App\Http\Controllers\Api\EventosController;
use App\Http\Controllers\Api\ChatbotController;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//ROTAS USUARIO
Route::post("/auth/login", [AuthController::class, 'login']);
Route::post("/auth/logout", [AuthController::class, 'logout']);
Route::post("/auth/refresh", [AuthController::class, 'refresh']);
Route::post("/user", [AuthController::class, 'create']);
Route::get("/user", [UserController::class, 'read']);
Route::middleware('auth:api')->get('/me', [AuthController::class, 'me']);

Route::resource("/interesses", InteressesController::class);
Route::resource("/atividades", AtividadesController::class);
Route::resource("/eventos", EventosController::class);

Route::post('/twitter-tweets', [TwitterController::class, 'getTweets']);

Route::post('/engagement', [TwitterController::class, 'getEngagementLevel']);

Route::get('/twitch/streams', [TwitchController::class, 'getAllStreamers']);

Route::post('/chatbot', [ChatbotController::class, 'responder']);
// Route::get('/twitch/users', [TwitchController::class, 'getStreamerDetail']);



