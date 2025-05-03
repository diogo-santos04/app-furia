<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('jogos', function (Blueprint $table) {
            $table->id();
            $table->date('data');
            $table->time('horario');
            $table->string('adversario');
            $table->string('local')->nullable();
            $table->string('campeonato');
            $table->string('status');
            $table->string('resultado')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jogos');
    }
};