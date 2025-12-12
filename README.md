# GW Rental App 🚛

A modern trailer rental application built with Angular 20 and Node.js/Express backend.

![Angular](https://img.shields.io/badge/Angular-20.3.5-red?style=flat-square&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=flat-square&logo=mongodb)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **User Authentication**
  - Secure signup with email verification
  - JWT-based login with refresh tokens
  - Password reset via email
  - Protected routes

- **Trailer Management**
  - Browse available trailers
  - Filter by location, type, and price
  - View detailed trailer information

- **User Experience**
  - Location-based services
  - Responsive design
  - Modern UI with warm red/cream theme

---

## 🛠 Tech Stack

### Frontend
- Angular 20
- TypeScript
- RxJS
- CSS3 (Custom styling)

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Resend (Email service)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Angular CLI](https://angular.io/cli) (v20+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Resend](https://resend.com) account (for emails)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/your-username/gw-rental-app.git
   cd gw-rental-app
```

2. **Install frontend dependencies**
```bash
   npm install
```

3. **Install backend dependencies**
```bash
   cd backend/server
   npm install
```

### Environment Setup

Create a `.env` file in `backend/server/`:
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/gw-rentals
RESEND_API_KEY=re_your_api_key
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
FRONTEND_URL=http://localhost:4200
PORT=3000
```

> ⚠️ Never commit your `.env` file. It's included in `.gitignore`.

---

## 💻 Running the App

### Start the Backend
```bash
cd backend/server
npx ts-node server.ts
```

Backend runs at: `http://localhost:3000`

### Start the Frontend
```bash
# From project root
ng serve
```

Frontend runs at: `http://localhost:4200`

---

## 📁 Project Structure
```
gw-rental-app/
├── src/                          # Frontend source
│   ├── app/
│   │   ├── app.ts                # Root component
│   │   ├── app.routes.ts         # Route definitions
│   │   ├── app.config.ts         # App configuration
│   │   ├── auth.service.ts       # Authentication service
│   │   └── location.service.ts   # Location service
│   ├── pages/
│   │   ├── home/                 # Home page
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── profile/              # User profile
│   │   ├── verify-email/         # Email verification
│   │   ├── reset-password/       # Password reset
│   │   ├── forgot-password/      # Forgot password
│   │   ├── trailers-list/        # Trailer listings
│   │   ├── trailers-details/     # Trailer details
│   │   ├── pricing/              # Pricing page
│   │   └── locations/            # Locations page
│   └── styles/                   # Global styles
│
├── backend/
│   └── server/
│       ├── server.ts             # Express server
│       ├── serverRoutes.ts       # API routes
│       ├── controllers/          # Route controllers
│       ├── middleware/           # Auth middleware
│       ├── models/               # MongoDB models
│       ├── services/             # Email service
│       └── utils/                # JWT utilities
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/verify-email` | Verify email address |
| POST | `/api/auth/resend-verification` | Resend verification email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/refresh-token` | Refresh access token |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### Trailers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trailers` | Get all trailers |
| GET | `/api/trailers/:id` | Get trailer by ID |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |

---

## 📸 Screenshots

> Add screenshots of your app here

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)

---

<p align="center">Made with ❤️ using Angular & Node.js</p>
