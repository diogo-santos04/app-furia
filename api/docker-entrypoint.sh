#!/bin/bash
set -e



if [ "$APP_ENV" = "production" ]; then
  echo "Executando migrações..."
  php artisan migrate --force
fi

php artisan serve --host=0.0.0.0 --port=8000

exec "$@"