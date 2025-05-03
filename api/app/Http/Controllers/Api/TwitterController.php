<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class TwitterController extends Controller
{
    public function getTweets(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'max_results' => 'sometimes|integer|min:1|max:100'
        ]);

        $username = $request->input('username');
        $maxResults = $request->input('max_results', 5);

        try {
            $userResponse = Http::withToken(env('TWITTER_BEARER_TOKEN'))
            ->get("https://api.twitter.com/2/users/by/username/{$username}");

            if (!$userResponse->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Usuário não encontrado no Twitter.',
                    'twitter_response' => $userResponse->json()
                ], 404);
            }

            $userId = $userResponse->json('data.id');

            $tweetsResponse = Http::withToken(env('TWITTER_BEARER_TOKEN'))
                ->get("https://api.twitter.com/2/users/{$userId}/tweets", [
                    'max_results' => $maxResults,
                    'tweet.fields' => 'created_at,text'
                ]);

            if (!$tweetsResponse->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Erro ao buscar tweets.'
                ], 400);
            }

            $tweets = $tweetsResponse->json();

            return response()->json([
                'status' => 'success',
                'username' => $username,
                'tweets' => $tweets['data'] ?? []
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro interno: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getEngagementLevel(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'max_results' => 'sometimes|integer|min:1|max:100'
        ]);

        $username = $request->input('username');
        $maxResults = $request->input('max_results', 5);

        try {
            $userResponse = Http::withToken(env('TWITTER_BEARER_TOKEN'))
                ->get("https://api.twitter.com/2/users/by/username/{$username}");

            if (!$userResponse->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Usuário não encontrado no Twitter.',
                    'twitter_response' => $userResponse->json()
                ], 404);
            }

            $userId = $userResponse->json('data.id');

            $tweetsResponse = Http::withToken(env('TWITTER_BEARER_TOKEN'))
                ->get("https://api.twitter.com/2/users/{$userId}/tweets", [
                    'max_results' => $maxResults,
                    'tweet.fields' => 'created_at,text,public_metrics'
                ]);


            if (!$tweetsResponse->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Erro ao buscar tweets.'
                ], 400);
            }

            $tweets = $tweetsResponse->json('data') ?? [];

            $totalEngagement = 0;

            foreach ($tweets as $tweet) {
                $metrics = $tweet['public_metrics'];
                $totalEngagement += $metrics['like_count'] + $metrics['retweet_count'] + $metrics['reply_count'];
            }

            return response()->json([
                'status' => 'success',
                'username' => $username,
                'total_engagement' => $totalEngagement,
                'tweets_counted' => count($tweets),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro interno: ' . $e->getMessage()
            ], 500);
        }
    }
}
