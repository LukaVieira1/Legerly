# Ledgerly Frontend

A modern web application built with Next.js 15 for managing store sales and payments.

## 🚀 Features

- 🔐 Authentication with JWT
- 📊 Dashboard with metrics
- 👥 Client management
- 💰 Sales control
- 💵 Payment tracking
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- ✨ Smooth animations with Framer Motion

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **State Management:** React Context + Hooks
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **UI Components:** Headless UI
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Notifications:** React Toastify

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- Backend API running (see [backend README](../backend/README.md))

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd [repository-name]/frontend
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env.local
   ```

4. Update environment variables:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5050 # or your backend URL
   ```

5. Start development server:
   ```bash
   yarn dev
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable components
│   ├── hooks/              # Custom hooks
│   ├── providers/          # Context providers
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── public/                 # Static files
└── tailwind.config.ts     # Tailwind configuration
```

## 🔑 Authentication

Default test users:

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

## 🎯 Available Scripts

```bash
# Development
yarn dev          # Start development server

# Production
yarn build        # Build for production
yarn start        # Start production server

# Linting
yarn lint         # Run ESLint
```

## 🔍 Common Issues

### API Connection

```bash
# Error: Cannot connect to API
# Solution: Check if backend is running
# Verify NEXT_PUBLIC_API_URL in .env.local
```

### Build Errors

```bash
# Error: Build fails
# Solution: Clear next cache
rm -rf .next
yarn build

# If error persists:
rm -rf node_modules
yarn install
yarn build
```

### Authentication Issues

```bash
# Error: Cannot login
# Solution:
# 1. Check if credentials are correct
# 2. Verify if backend is running
# 3. Clear browser cookies
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop computers

## 🎨 UI Components

Built with custom components using:

- Tailwind CSS for styling
- Headless UI for accessibility
- Framer Motion for animations
- React Icons for iconography

## 🔄 State Management

Uses React Context for:

- User authentication
- Client management
- Sales control
- Theme preferences

## 📈 Performance

Optimized with:

- Route prefetching
- Image optimization
- Code splitting
- Dynamic imports

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
