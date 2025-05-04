#!/bin/sh
set -e

# Criar arquivo .env manualmente se não existir
if [ ! -f ".env" ]; then
  echo "Criando arquivo .env manualmente..."
  
  # Criar um arquivo .env básico com configurações padrão
  cat > .env << EOF
APP_NAME=Laravel
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost

LOG_CHANNEL=stderr
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=${DB_HOST:-postgres}
DB_PORT=${DB_PORT:-5432}
DB_DATABASE=${DB_DATABASE:-laravel}
DB_USERNAME=${DB_USERNAME:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120
EOF

  echo ".env criado com sucesso!"
fi

# Gerar chave do aplicativo se não existir
php artisan key:generate --force

# Executar migrações (apenas se a conexão com o banco for bem-sucedida)
php artisan migrate --force || echo "Migração falhou, mas continuando..."

# Limpar cache
php artisan optimize:clear

# Iniciar o servidor
echo "Iniciando servidor na porta ${PORT:-8000}..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}