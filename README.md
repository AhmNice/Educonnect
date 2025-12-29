# **EduConnect**

EduConnect is a full-stack, learning-focused collaboration platform designed to help students connect, study, and communicate effectively.
It features a **React + Vite** frontend and a **Node.js / Express** backend, with real-time chat, course resources, study groups, and admin analytics.

---

## 📌 Table of Contents

* Overview
* Features
* Tech Stack
* Repository Structure
* Prerequisites
* Environment Variables
* Installation & Local Development
* Development Notes
* API & Routes Overview
* Important Client Files
* Testing & Linting
* Deployment
* Troubleshooting
* Contributing
* Contact

---

## 🚀 Overview

EduConnect is a monorepo structured into two main directories:

* **`client/`** — A modern React application bootstrapped with Vite
* **`server/`** — An Express.js REST API with real-time support via Socket.IO

The platform enables students to access courses, collaborate in study groups, exchange messages in real time, and allows administrators to monitor platform usage through analytics.

---

## ✨ Features

* User authentication & session management
* Real-time chat using Socket.IO
* Courses and learning resources management
* Study groups (create, join, manage)
* Admin dashboard and analytics
* File uploads via Cloudinary
* Email notifications

---

## 🧰 Tech Stack

### Frontend

* React
* Vite
* tailwindcss
* Zustand (state management)

### Backend

* Node.js
* Express.js
* Socket.IO (real-time messaging)

### Integrations

* Cloudinary (file uploads)
* SMTP email service
* Database (configured via environment variables)

Database configuration lives in:
`server/src/config/db.config.js`

---

## 📁 Repository Structure

```
educonnect/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── store/          # State stores (auth, courses, groups, etc.)
│       ├── hook/           # Custom hooks & route guards
│       ├── lib/            # Helpers (Axios, Socket.IO)
│       ├── App.jsx
│       └── main.jsx
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # DB, Cloudinary, email, socket configs
│   │   ├── controller/     # Route controllers
│   │   ├── model/          # Data models
│   └── server.js           # Server entry point
```

### Key Files to Review

* `server/src/config/db.config.js`
* `server/src/config/cloudinary.js`
* `server/src/config/email.config.js`
* `server/src/config/socket.io_config.js`
* `client/src/store`
* `client/src/hook`

---

## ✅ Prerequisites

* Node.js (v16+ or current LTS recommended)
* npm or yarn
* A running database instance
* Cloudinary account (optional for local development)
* SMTP credentials for email features

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret

DATABASE_URL=postgres://user:pass@host:5432/dbname
# OR
DB_HOST=localhost
DB_USER=user
DB_PASS=password
DB_NAME=educonnect

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASS=your_password

FRONTEND_URL=http://localhost:5173
```

⚠️ Always verify required variable names in `server/src/config`.

---

## 🛠️ Installation & Local Development

### 1️⃣ Client

```bash
cd client
npm install
npm run dev
```

* Runs on `http://localhost:5173` by default.

---

### 2️⃣ Server

```bash
cd server
npm install
npm run dev
```

* Default API URL: `http://localhost:5000` (configurable via `PORT`).

---

### 3️⃣ Running Both

Use two terminals:

* One for the frontend (Vite)
* One for the backend (Express)

The frontend communicates with the backend using configured API URLs or proxies.

---

## 🧪 Development Notes

* Hot reload is enabled:

  * Vite for frontend
  * Nodemon (or similar) for backend
* Socket.IO:

  * Server config: `server/src/config/socket.io_config.js`
  * Client helper: `client/src/lib/socket_io.js`
* Check both terminal logs and browser console for debugging.

---

## 🔌 API & Routes Overview

All API logic lives in `server/src/controller`.

| Endpoint         | Description             |
| ---------------- | ----------------------- |
| `/api/auth`      | Authentication & OTP    |
| `/api/users`     | User profile & settings |
| `/api/courses`   | Courses & content       |
| `/api/groups`    | Study groups            |
| `/api/messages`  | Messaging               |
| `/api/resources` | File uploads            |
| `/api/stats`     | Admin analytics         |

Inspect the controller files for exact route definitions.

---

## 📄 Important Client Files

* `client/src/main.jsx` — Application entry point
* `client/src/App.jsx` — Routing & providers
* `client/src/layout/PageLayout.jsx` — App layout
* `client/src/store/` — Global state management

---

## 🧹 Testing & Linting

* ESLint configuration: `client/eslint.config.js`
* No test framework is bundled by default
  (You may add Vitest or Jest as needed)

---

## 🚢 Deployment

### Frontend

```bash
cd client
npm run build
```

Deploy the generated `dist/` folder to any static hosting service.

### Backend

* Deploy to any Node-compatible platform:

  * Heroku
  * DigitalOcean
  * AWS
* Ensure environment variables and production DB are correctly set.

---

## 🧯 Troubleshooting

* API connection issues:

  * Verify `FRONTEND_URL`
  * Check CORS configuration
* Database errors:

  * Confirm DB credentials
  * Ensure DB server is running
* Upload failures:

  * Validate Cloudinary credentials

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run the project locally
4. Submit a PR with a clear description

Please follow existing folder structure and coding conventions.

---

## 📬 Contact

For issues, questions, or suggestions:

* Open a GitHub issue
* Or contact the repository owner directly

---


