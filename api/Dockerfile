FROM bitnami/laravel:10

USER root

# Copiar os arquivos do projeto
COPY . /app

# Certificar que as permissões estão corretas
RUN chown -R bitnami:bitnami /app && \
    chmod -R 775 /app/storage /app/bootstrap/cache

# Mudar para o usuário padrão não-root
USER bitnami

# Limpar os caches
RUN php artisan optimize:clear

# Exponha a porta 8000 para o tráfego web
EXPOSE 8000

# Comando para iniciar o servidor Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]