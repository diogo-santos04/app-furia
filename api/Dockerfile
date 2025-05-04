FROM php:8.1-fpm

# Instalação mínima de dependências
RUN apt-get update && \
    apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Configurar diretório de trabalho
WORKDIR /var/www/html

# Copiar todo o projeto (incluindo vendor pré-compilado)
COPY . .

# Script de entrada
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expor porta
EXPOSE 8000

# Comando de inicialização
CMD ["/usr/local/bin/docker-entrypoint.sh"]