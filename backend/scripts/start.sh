#!/bin/sh

echo "Waiting for PostgreSQL to start..."
/app/scripts/wait-for-it.sh postgres 5432

echo "Generating Prisma Client..."
npx prisma generate

# Verifica se já existem migrations
if [ ! -d "prisma/migrations" ]; then
  echo "Creating initial migration..."
  npx prisma migrate dev --name init --create-only
fi

echo "Running migrations..."
npx prisma migrate deploy

# Executa os seeders apenas se RUN_SEED for "true"
if [ "$NODE_ENV" = "development" ] && [ "$RUN_SEED" = "true" ]; then
  echo "Running seeders..."
  npx prisma db seed
fi

echo "Starting Prisma Studio..."
npx prisma studio --port 5555 --hostname 0.0.0.0 &

echo "Starting application..."
exec yarn dev 