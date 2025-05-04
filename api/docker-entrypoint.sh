#!/bin/sh
set -e

# Configurar o arquivo .env se estiver faltando
if [ ! -f ".env" ]; then
  echo "Criando arquivo .env..."
  cp .env.example .env
fi

# Executar migrações
php artisan migrate --force

# Limpar cache
php artisan optimize:clear

# Iniciar o servidor
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}