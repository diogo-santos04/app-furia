<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jogadores;

class JogadoresSeeder extends Seeder
{
    public function run(): void
    {
        $jogadores = [
            [
                'nome' => 'Gabriel Toledo',
                'apelido' => 'FalleN',
                'posicao' => 'AWPer / IGL',
                'pais' => 'Brasil',
            ],
            [
                'nome' => 'Kaike Cerato',
                'apelido' => 'KSCERATO',
                'posicao' => 'Rifler',
                'pais' => 'Brasil',
            ],
            [
                'nome' => 'Yuri Boian',
                'apelido' => 'yuurih',
                'posicao' => 'Rifler',
                'pais' => 'Brasil',
            ],
            [
                'nome' => 'Marcelo Robalo',
                'apelido' => 'molodoy',
                'posicao' => 'Entry Fragger',
                'pais' => 'Brasil',
            ],
            [
                'nome' => 'Mareks Gaļinskis',
                'apelido' => 'YEKINDAR',
                'posicao' => 'Rifler / Entry',
                'pais' => 'Letônia',
            ],
        ];

        foreach ($jogadores as $jogador) {
            Jogadores::updateOrCreate(
                ['apelido' => $jogador['apelido']],
                array_merge($jogador, ['ativo' => true])
            );
        }
    }
}
