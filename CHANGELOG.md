# Changelog

## 2025-01-20, v0.2.0

### Added

- client routes
- user routes
- store routes
- sale routes
- payment routes
- postman collection
- auth routes
- readme improvements

## 2025-01-19, v0.1.0

### Added

- TypeScript support
  - Added TypeScript configuration with `tsconfig.json`
  - Added necessary TypeScript dependencies
- Prisma Studio auto-start
  - Added port 5555 exposure in Dockerfile and docker-compose
  - Configured Prisma Studio to start automatically with the container
- Comprehensive seed data
  - Added example store with users, clients, and sales
  - Created different user roles (Owner, Manager, Employee)
  - Added test sales data with payments
- Docker environment improvements
  - Added health check for PostgreSQL container
  - Improved container startup sequence
  - Added wait-for-it script for database connection
- Environment variable control for seeding
  - Added RUN_SEED environment variable
  - Configured conditional seeding based on environment
