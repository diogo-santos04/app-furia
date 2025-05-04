#!/bin/sh
set -e

echo "Verificando ambiente..."

# Verificar se vendor existe, se não, instalar dependências
if [ ! -d "vendor" ]; then
    echo "Diretório vendor não encontrado, instalando dependências..."
    composer install --no-interaction --optimize-autoloader --no-dev
else
    echo "Diretório vendor encontrado!"
fi

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
  echo "Criando arquivo .env..."
  
  # Criar um arquivo .env básico
  cat > .env << EOF
APP_NAME=Laravel
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=${APP_URL:-http://localhost}

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

# Verificar se autoload.php existe
if [ ! -f "vendor/autoload.php" ]; then
    echo "ERRO: vendor/autoload.php não encontrado!"
    echo "Tentando instalar dependências novamente..."
    composer install --no-interaction --optimize-autoloader --no-dev
    
    if [ ! -f "vendor/autoload.php" ]; then
        echo "ERRO CRÍTICO: Falha ao instalar dependências do Composer!"
        exit 1
    fi
fi

# Gerar chave do aplicativo
echo "Gerando chave da aplicação..."
php artisan key:generate --force

# Verificar conexão com o banco de dados
echo "Verificando conexão com o banco de dados..."
php artisan db:monitor || echo "Aviso: Não foi possível verificar a conexão com o banco de dados. Continuando..."

# Executar migrações
echo "Executando migrações..."
php artisan migrate --force || echo "Aviso: Migrações falharam, mas continuando..."

# Otimizar aplicação
echo "Otimizando aplicação..."
php artisan optimize || echo "Aviso: Otimização falhou, mas continuando..."

echo "Iniciando servidor na porta ${PORT:-8000}..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}