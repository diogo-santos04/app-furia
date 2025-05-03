<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/oauth/redirect', function () {
    $query = http_build_query([
        'client_id' => '7b3xuvlzmrxhui1bcztth7tbves6gh',
        'redirect_uri' => 'http://localhost:8000/api/oauth/callback',
        'response_type' => 'code',
        'scope' => 'user:read:email', // ou outros scopes
    ]);

    return redirect('https://id.twitch.tv/oauth2/authorize?' . $query);
});