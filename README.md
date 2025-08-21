# Mern-Authentication


A full-stack MERN (MongoDB, Express, React, Node.js) authentication system with JWT-based authentication, email verification, password reset, and cookie-based sessions. The project uses Vite for the frontend.

Features

User Registration & Login

JWT-based Authentication

Email Verification via OTP

Password Reset via OTP

Cookie-based session management

Protected routes with middleware (userAuth)

Tech Stack
Frontend

React (Vite)

Axios (HTTP client)

React Toastify (notifications)

React Context API (state management)

CSS/Bootstrap for styling

Backend

Node.js + Express

MongoDB (via Mongoose)

JWT (JSON Web Token)

Cookie-parser for cookie management

CORS for cross-origin requests

Project Structure
root/
├─ client/                # React frontend
│  ├─ src/
│  │  ├─ pages/           # Home, Login, Dashboard, etc.
│  │  ├─ components/      # Navbar, Forms
│  │  ├─ context/         # AppContextProvider
│  │  └─ App.jsx
│  ├─ .env                # Local environment variables
│  └─ vite.config.js
├─ server/                # Node.js backend
│  ├─ config/             # MongoDB connection
│  ├─ controller/         # Auth controller
│  ├─ middleware/         # userAuth middleware
│  ├─ routes/             # authRouter
│  └─ index.js
└─ README.md

Environment Variables
Backend (server/.env)
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Frontend (client/.env)
VITE_BACKEND_URL=http://localhost:4000


VITE_BACKEND_URL points to your local backend.

No live deployment needed.

Installation
1. Backend
cd server
npm install

2. Frontend
cd client
npm install

Running Locally
Backend
cd server
npm run dev


Runs backend on: http://localhost:4000

Frontend
cd client
npm run dev


Runs frontend on: http://localhost:5173

CORS Configuration

For local development, backend should allow localhost frontend:

import cors from 'cors';

const allowedOrigins = ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

Cookies & JWT

Login sets a JWT cookie:

res.cookie('token', token, {
  httpOnly: true,
  secure: false,      // false for local development
  sameSite: 'lax'     // local dev compatible
});


Protected routes use userAuth middleware to verify JWT in cookies.

API Routes

| Route                           | Method | Auth Required | Description                     |
| ------------------------------- | ------ | ------------- | ------------------------------- |
| /api/auth/register              | POST   | No            | Register a new user             |
| /api/auth/login                 | POST   | No            | Login user & set JWT cookie     |
| /api/auth/logout                | POST   | No            | Logout user and clear cookie    |
| /api/auth/send-verification-otp | POST   | Yes           | Send OTP for email verification |
| /api/auth/verify-otp            | POST   | Yes           | Verify OTP for account          |
| /api/auth/is-auth               | POST   | Yes           | Check if user is authenticated  |
| /api/auth/send-reset-otp        | POST   | No            | Send OTP for password reset     |
| /api/auth/reset-password        | POST   | No            | Reset password using OTP        |

Open frontend at http://localhost:5173

Register a new user and login

Verify OTP and try password reset

Check network tab in DevTools to confirm API calls go to backend

Cookies should appear in Application → Cookies

Troubleshooting

401 Unauthorized on /is-auth

Make sure cookies are sent with withCredentials: true

Backend CORS allows http://localhost:5173

Backend not reachable

Check VITE_BACKEND_URL and backend port

Make sure backend is running (npm run dev in server)

Contributing

Fork the repository

Create a branch (git checkout -b feature-name)

Make changes & commit (git commit -m "Feature description")

Push to branch (git push origin feature-name)

Create a Pull Request
