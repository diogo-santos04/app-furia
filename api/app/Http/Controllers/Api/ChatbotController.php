<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Jogos;
use App\Models\Jogadores;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    public function responder(Request $request)
    {
        $pergunta = $request->input('mensagem');

        $jogo = Jogos::where('status', 'proximo')->orderBy('data')->first();

        $contexto = $jogo
            ? "Próximo jogo: {$jogo->adversario} - {$jogo->campeonato} - {$jogo->data} às {$jogo->horario}"
            : "Nenhum jogo marcado no momento.";

        $ativos = Jogadores::where('ativo', true)->get();

        if ($ativos->count()) {
            $nomes = $ativos->map(fn($j) => "{$j->apelido}")->join(", ");
            $contexto .= "\nJogadores atuais: $nomes";
        }

        $systemPrompt = <<<PROMPT
Você é um assistente da FURIA. Siga estritamente estas diretrizes:

- Responda apenas o que foi perguntado
- Seja direto e objetivo
- Use frases curtas e simples
- Evite exageros e excesso de emojis (máximo 1-2 por resposta)
- Ofereça apenas informações relevantes à pergunta
- Omita informações se não tiver certeza
- Use linguagem casual, mas não exageradamente informal
- Divida informações com quebras de linha SEMPRE
- Divida informações com quebras de linha SEMPRE
- Divida informações com quebras de linha SEMPRE
- Utilize emotes mas não excessivamente, apenas para melhorar a mensagem.
Não tente simular entusiasmo excessivo ou usar gírias forçadas.
Não dê mais detalhes do que o necessário.
PROMPT;

        $payload = [
            'model' => 'gemma3:12b',
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => "Contexto atual:\n$contexto"],
                ['role' => 'user', 'content' => $pergunta],
            ],
            'stream' => false
        ];

        $response = Http::post('http://127.0.0.1:11434/api/chat', $payload);

        if ($response->failed()) {
            return response()->json([
                'resposta' => 'Desculpe, não consegui processar sua solicitação no momento.'
            ], 500);
        }

        $conteudo = $response->json()['message']['content'] ?? 'Não foi possível gerar uma resposta.';

        return response()->json([
            'resposta' => $conteudo
        ]);
    }
}