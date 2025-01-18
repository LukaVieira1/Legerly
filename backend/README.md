# Backend Documentation

## 🚀 First Time Setup

1. Clone the repository and navigate to the backend directory:

   ```bash
   git clone [repository-url]
   cd [repository-name]/backend
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with the following settings:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@postgres:5432/legerly?schema=public"
   ```

5. Start the project for the first time:

   ```bash
   # Build and start containers
   docker-compose up --build -d

   # Check if containers are running
   docker-compose ps

   # Check the logs
   docker-compose logs -f

   # Run the initial seed (required for first time)
   docker-compose exec -e RUN_SEED=true backend yarn db:seed
   ```

This will set up:

- PostgreSQL database
- Prisma with initial migrations
- Example data with users, clients and sales
- Prisma Studio for database management

After the setup, you can access:

- API: http://localhost:5050
- Prisma Studio: http://localhost:5555
- Database: localhost:5432

## 🛠️ Development Commands

### Docker Commands

#### Container Management

```bash
# Start containers
docker-compose up -d

# Start containers with rebuild
docker-compose up --build -d

# Stop containers
docker-compose down

# Stop containers and remove volumes
docker-compose down -v

# Remove all unused containers, networks, images
docker system prune -f

# Restart specific service
docker-compose restart backend
```

#### Logs

```bash
# View all logs
docker-compose logs -f

# View backend logs
docker-compose logs -f backend

# View database logs
docker-compose logs -f postgres
```

#### Container Access

```bash
# Access backend container
docker-compose exec backend sh

# Access database container
docker-compose exec postgres sh
```

#### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

#### Seed Commands

```bash
# Run seed (outside container)
docker-compose exec -e RUN_SEED=true backend yarn db:seed

# Run seed (inside container)
yarn db:seed
# or
npx prisma db seed
```

### Test Data

#### Default Users

```
Owner:
  - Email: owner@example.com
  - Password: owner123

Manager:
  - Email: manager@example.com
  - Password: manager123

Employee:
  - Email: employee@example.com
  - Password: employee123
```

#### Database GUI Access

Prisma Studio is available at `http://localhost:5555` when containers are running.

## 🔍 Troubleshooting Guide

### Common Issues

1. **Container won't start**

   ```bash
   # Check logs
   docker-compose logs -f

   # Verify container status
   docker-compose ps
   ```

2. **Database connection issues**

   ```bash
   # Verify PostgreSQL is running
   docker-compose logs postgres

   # Check connection from backend
   docker-compose exec backend sh
   nc -zv postgres 5432
   ```

3. **Migration issues**
   ```bash
   # Reset migrations
   docker-compose exec backend sh
   npx prisma migrate reset --force
   ```

### Complete Reset Procedure

If you need to start fresh:

1. Stop and remove everything:

   ```bash
   docker-compose down -v
   docker system prune -f
   ```

2. Rebuild and start:

   ```bash
   docker-compose up --build -d
   ```

3. Run initial seed:
   ```bash
   docker-compose exec -e RUN_SEED=true backend yarn db:seed
   ```

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.js          # Seed data
├── scripts/
│   ├── start.sh         # Container startup script
│   └── wait-for-it.sh   # Database wait script
├── src/
│   └── server.js        # Main application file
├── Dockerfile           # Container configuration
└── package.json         # Dependencies and scripts
```
