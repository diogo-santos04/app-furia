FROM php:8.1-fpm

# Definir variáveis de ambiente para instalação não interativa
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_MEMORY_LIMIT=-1

# Instalação mínima de dependências
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get update && \
    apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    postgresql-client \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath && \
    docker-php-ext-configure gd && \
    docker-php-ext-install gd

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Copiar apenas os arquivos de configuração primeiro
COPY composer.json composer.lock ./

# Instalar dependências do PHP sem scripts
RUN composer install --no-scripts --no-autoloader --no-interaction --no-dev

# Copiar o resto dos arquivos do projeto
COPY . .

# Finalizar a instalação do Composer
RUN composer dump-autoload --optimize --no-dev

# Permissões para o Laravel
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data /var/www/html

# Preparar o entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expor porta
EXPOSE 8000

# Comando de inicialização
CMD ["/usr/local/bin/docker-entrypoint.sh"]