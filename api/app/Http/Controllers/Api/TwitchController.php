<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class TwitchController extends Controller
{
    public function getAllStreamers(Request $request)
    {
        $clientId = env('TWITCH_CLIENT_ID'); 
        $accessToken = env('TWITCH_ACCESS_TOKEN'); 

        $streamers = ['gafallen','mount', 'paulanobre', 'sofiaespanha', 'XAROLA_', 'otsukaxd', 'mwzera', 'dgzinxl99', 'kscerato', 'chelok1ng'];
    
        $streamResponse = Http::withHeaders([
            'Client-ID' => $clientId,
            'Authorization' => 'Bearer ' . $accessToken,
        ])->get('https://api.twitch.tv/helix/streams', [
            'user_login' => $streamers  
        ]);
            
        if ($streamResponse->failed()) {
            return response()->json(['error' => 'Error fetching streamer data'], 500);
        }
    
        $liveStreamers = $streamResponse->json()['data'];
        
        $liveStreamersMap = [];
        foreach ($liveStreamers as $stream) {
            $liveStreamersMap[$stream['user_id']] = $stream;
        }
    
        $userResponse = Http::withHeaders([
            'Client-ID' => $clientId,
            'Authorization' => 'Bearer ' . $accessToken,
        ])->get('https://api.twitch.tv/helix/users', [
            'login' => $streamers,  
        ]);
    
        if ($userResponse->failed()) {
            return response()->json(['error' => 'Error fetching streamer details'], 500);
        }
    
        $allStreamers = $userResponse->json()['data'];
        
        $streamersWithDetails = array_map(function($user) use ($liveStreamersMap) {
            $isLive = isset($liveStreamersMap[$user['id']]);
            $liveData = $isLive ? $liveStreamersMap[$user['id']] : null;
    
            return [
                'user_name' => $user['login'],
                'display_name' => $user['display_name'],
                'avatar_url' => $user['profile_image_url'], 
                'is_live' => $isLive,
                'game_name' => $isLive ? $liveData['game_name'] : 'Offline',
                'viewer_count' => $isLive ? $liveData['viewer_count'] : 0,
                'thumbnail_url' => $isLive ? 
                    str_replace(
                        ['{width}', '{height}'], 
                        ['440', '248'], 
                        $liveData['thumbnail_url']
                    ) : null,
                'title' => $isLive ? $liveData['title'] : null,
            ];
        }, $allStreamers);
    
        return response()->json($streamersWithDetails);
    }
}