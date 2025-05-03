<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class JogosTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('jogos')->insert([
            [
                'data' => '2025-05-02',
                'horario' => '20:00:00',
                'adversario' => 'NAVI',
                'local' => 'Online',
                'campeonato' => 'BLAST Premier Spring',
                'status' => 'proximo',
                'resultado' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'data' => '2025-04-25',
                'horario' => '18:00:00',
                'adversario' => 'Team Liquid',
                'local' => 'Estocolmo',
                'campeonato' => 'ESL Pro League',
                'status' => 'finalizado',
                'resultado' => '2x1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'data' => '2025-05-10',
                'horario' => '15:30:00',
                'adversario' => 'G2 Esports',
                'local' => 'Colônia',
                'campeonato' => 'IEM Cologne',
                'status' => 'proximo',
                'resultado' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

