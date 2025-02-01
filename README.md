# 🏪 Ledgerly

<div align="center">

![Ledgerly Logo](frontend/public/logo.png)

A modern full-stack application for managing store sales and payments.

[![Backend](https://img.shields.io/badge/Backend-Fastify-green)](backend/README.md)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js-blue)](frontend/README.md)

</div>

## 📖 About

Ledgerly is a store management system designed to help small businesses track their sales and payments. Originally created for my mother's store, it has been open-sourced as a portfolio project. Because of the nature of the project, the values, numbers and names are brazilian, so it's not a good example for international use.

## 📝 Demo

You can see the live demo [here]() //coming soon.

## 📝 Demo Users

```
Owner:
  Email: owner@example.com
  Password: owner123

Manager:
  Email: manager@example.com
  Password: manager123

Employee:
  Email: employee@example.com
  Password: employee123
```

### Key Features

- 🔐 Role-based authentication (Owner, Manager, Employee)
- 📊 Real-time sales dashboard
- 👥 Client management with payment history
- 💰 Sales tracking with installment support
- 💵 Payment control and balance tracking
- 📱 Responsive design for all devices
- 🌐 Modern and intuitive interface

## 🚀 Tech Stack

### Backend

- Node.js with Fastify
- PostgreSQL with Prisma ORM
- JWT Authentication
- Docker containerization

### Frontend

- Next.js 15
- Tailwind CSS
- React Context + Hooks
- TypeScript

## 🛠️ Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Yarn package manager

### Running the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ledgerly.git
   cd ledgerly
   ```

2. Start the backend (you can see the backend documentation [here](backend/README.md)):

   ```bash
   cd backend
   yarn install
   docker-compose up -d
   docker-compose exec -e RUN_SEED=true backend yarn db:seed
   ```

3. Start the frontend (you can see the frontend documentation [here](frontend/README.md)):

   ```bash
   cd frontend
   yarn install
   yarn dev
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5050
   - Prisma Studio: http://localhost:5555

## 📚 Documentation

- [Backend Documentation](backend/README.md)

  - API endpoints
  - Database schema
  - Authentication
  - Docker setup

- [Frontend Documentation](frontend/README.md)
  - Components
  - State management
  - Routing
  - Styling

## 🎯 Project Structure

```
ledgerly/
├── backend/              # Fastify API
│   ├── src/             # Source code
│   ├── prisma/          # Database schema and migrations
│   └── docker/          # Docker configuration
│
├── frontend/            # Next.js application
│   ├── src/            # Source code
│   ├── public/         # Static files
│   └── components/     # React components
│
└── docs/               # Documentation files
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- My mother, for inspiring this project
- The open-source community for amazing tools
- All contributors and users of Ledgerly

```

```
