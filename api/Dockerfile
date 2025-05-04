FROM php:8.1-fpm

# Variáveis de ambiente
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_MEMORY_LIMIT=-1

# Instalação de dependências
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev \
    libonig-dev \
    libxml2-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos do projeto
COPY . .

# Verificar se vendor existe, se não, instalar dependências
RUN if [ ! -d "/var/www/html/vendor" ]; then \
        echo "Instalando dependências com Composer..." && \
        composer install --no-interaction --optimize-autoloader --no-dev; \
    else \
        echo "Diretório vendor encontrado, pulando instalação do Composer"; \
    fi

# Ajustar permissões
RUN chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data .

# Script de entrada
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expor porta
EXPOSE 8000

# Comando de inicialização
CMD ["/usr/local/bin/docker-entrypoint.sh"]