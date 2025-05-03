<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('cpf')->unique();
            $table->string('pais')->nullable();
            $table->string('estado')->nullable();
            $table->json('interesses')->nullable(); 
            $table->json('atividades')->nullable(); 
            $table->json('eventos')->nullable();    
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
