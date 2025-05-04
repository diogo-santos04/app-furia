FROM php:8.3-fpm

# Configuração para evitar interação durante instalação de pacotes
ENV DEBIAN_FRONTEND=noninteractive

# Instala dependências do sistema e pacotes PHP
RUN apt-get update --fix-missing && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    gnupg \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Instala Node.js LTS (via NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define diretório de trabalho
WORKDIR /var/www/html

# Copia arquivos de configuração do projeto
COPY composer.json composer.lock package.json package-lock.json ./

# Instala dependências PHP do Laravel
RUN composer install --no-scripts --no-autoloader --no-interaction

# Copia todos os arquivos do projeto
COPY . .

# Finaliza a instalação do Composer com autoload otimizado
RUN composer dump-autoload --optimize && \
    composer run-script post-autoload-dump

# Permissões corretas para storage e cache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage \
    && chmod -R 775 bootstrap/cache

# Expõe porta do Laravel
EXPOSE 8000

# Copia e habilita entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

CMD ["docker-entrypoint.sh"]