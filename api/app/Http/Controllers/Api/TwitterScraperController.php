<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class TwitterScraperController extends Controller
{
    public function scrape(Request $request)
    {
        $request->validate([
            'twitter_url' => 'required|url'
        ]);

        $url = $request->input('twitter_url');

        // Corrigir o link automaticamente
        $url = $this->normalizeTwitterUrl($url);

        try {
            $response = Http::withOptions([
                'verify' => false, // Ignora SSL para ambiente local
            ])->get($url);

            if (!$response->successful()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Falha ao acessar a URL: ' . $url
                ], 400);
            }

            $html = $response->body();

            // Aqui você pode usar alguma lógica simples para extrair coisas básicas
            // Exemplo: pegar o título da página
            preg_match('/<title>(.*?)<\/title>/', $html, $matches);
            $title = $matches[1] ?? 'Título não encontrado';

            return response()->json([
                'status' => 'success',
                'url_scraped' => $url,
                'page_title' => $title,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erro no scraping: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function normalizeTwitterUrl($url)
    {
        if (str_contains($url, 'x.com') || str_contains($url, 'twitter.com')) {
            // Extrair username
            preg_match('/(twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/', $url, $matches);
            $username = $matches[2] ?? null;

            if ($username) {
                // Montar URL mobile
                return "https://mobile.twitter.com/{$username}";
            }
        }

        return $url; // Se já estiver ok
    }
}
