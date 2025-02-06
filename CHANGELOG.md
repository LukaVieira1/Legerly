# Changelog

## 2025-02-06, v0.3.2

### Fixed

- Cannot create store if user is not admin
- Cannot create user if user is not admin
  - Super user, created because of the need to create the first store and admin user
  - Super user is created with a secret key, which is stored in the .env file
- Start script, which runs migrations, seeds and starts the server

## 2025-02-04, v0.3.1

### Fixed

- Frontend container
- Seed data
- Numeric keyboard in client phone input
- Duplicate request for sale list
- Unfocused input in client search
- Currency format in sale page
- App icon
- Remove delay in requests, used to show loading
- Scripts to start backend and frontend

## 2025-01-21, v0.3.0

### Added

- Frontend application with Next.js 15
  - Modern UI with Tailwind CSS
  - Authentication system
  - Dashboard layout
  - Client management
  - Sales management
  - Payment tracking
  - Responsive design
- Project branding
  - Custom SVG logo
  - Favicon
  - Color scheme
- Documentation improvements
  - Comprehensive README
  - Frontend setup guide
  - Project structure documentation
  - Development workflow
- Environment configuration
  - Docker setup for full-stack
  - Environment variables management
  - Development scripts

### Changed

- Documentation organization
- Development workflow
- Environment setup process

## 2025-01-20, v0.2.0

### Added

- Backend API routes
  - Client routes
  - User routes
  - Store routes
  - Sale routes
  - Payment routes
- Authentication system
  - JWT implementation
  - Role-based access control
- API Documentation
  - Postman collection
  - README improvements
  - API endpoints documentation

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
