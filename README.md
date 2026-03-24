<div align="center">

# CAMPUSLINK

_Connecting Students Through Study, Events, and Community Engagement_

![GitHub Last Commit](https://img.shields.io/github/last-commit/razeev.asnx/CampusLink?label=last%20commit&color=blue&style=flat-square)
![Node.js](https://img.shields.io/badge/node.js-18.x-green?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/react-18.x-blue?style=flat-square&logo=react)

![Express.js](https://img.shields.io/badge/-Express.js-black?style=flat-square&logo=express)
![React](https://img.shields.io/badge/-React-blue?style=flat-square&logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white)
![Bootstrap](https://img.shields.io/badge/-Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![Bcrypt](https://img.shields.io/badge/-Bcrypt-green?style=flat-square)

</div>

---

## 📋 Overview

CampusLink is a full-stack web application designed to enhance student engagement and community building at universities. It enables students to discover campus events, connect with study buddies, form study groups, and stay updated with campus notifications—all in one unified platform.

Whether you're looking for study partners, want to organize study sessions, or wish to stay informed about campus activities, CampusLink makes it easy and intuitive.

---

## ✨ Key Features

- **🎓 Study Buddy Connection** - Find and connect with other students for collaborative learning and mutual support
- **📅 Event Management** - Create, discover, and RSVP to campus events; admins can manage all events
- **👥 Study Groups** - Form or join study groups focused on specific subjects or courses
- **🔔 Real-time Notifications** - Stay updated with event reminders and group activities
- **👤 User Profiles** - Customize your profile, save favorite events, and track your academic interests
- **🛡️ Secure Authentication** - JWT-based authentication with role-based access control (student and admin)
- **🔐 Admin Dashboard** - Comprehensive admin panel for managing users, events, and platform moderation

---

## 🛠 Technology Stack

| Component          | Technology                                            |
| ------------------ | ----------------------------------------------------- |
| **Frontend**       | React 18.3+, React Router v6, Bootstrap 5, Axios      |
| **Backend**        | Node.js 18+, Express.js 5.2+, PostgreSQL              |
| **Authentication** | JWT (JSON Web Tokens), bcrypt password hashing        |
| **Development**    | npm, nodemon for hot-reload                           |
| **Security**       | CORS, environment variables, role-based authorization |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 12.x or higher

### Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/razeev.asnx/CampusLink.git
```

#### 2. Navigate to Project Directory

```bash
cd CampusLink
```

#### 3. Setup Database

```bash
psql -U postgres -c "CREATE DATABASE campuslink;"
```

#### 4. Import Database Schema

```bash
psql -U postgres -d campuslink < database/schema.sql
```

#### 5. Seed Sample Data (Optional)

```bash
psql -U postgres -d campuslink < database/seed.sql
```

#### 6. Setup Backend

```bash
cd backend
```

```bash
npm install
```

```bash
cp .env.example .env
```

Edit `.env` and configure:

```
PORT=8000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/campuslink
JWT_SECRET=your-secret-key-here
```

```bash
npm run dev
```

Backend will run on `http://localhost:8000`

#### 7. Setup Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

```bash
npm install
```

```bash
npm start
```

Frontend will open at `http://localhost:3000`

#### 8. Verify Installation

- Navigate to `http://localhost:3000`
- Register a new account or login with demo credentials
- Explore the dashboard, events, and study buddies features

---

## 📁 Project Structure

```
CampusLink/
├── backend/                    # Express.js server
│   ├── src/
│   │   ├── server.js          # Main server entry point
│   │   ├── seed.js            # Database seeding script
│   │   ├── config/
│   │   │   └── db.js          # Database configuration
│   │   ├── controllers/        # Business logic
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── eventController.js
│   │   │   ├── buddyController.js
│   │   │   ├── groupController.js
│   │   │   ├── notificationController.js
│   │   │   └── adminController.js
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Authentication & validation
│   │   └── ...
│   ├── package.json
│   └── .env.example
├── frontend/                  # React application
│   ├── src/
│   │   ├── App.js            # Main app component
│   │   ├── index.js          # React entry point
│   │   ├── styles.css        # Global styles
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React context (auth)
│   │   ├── pages/            # Page components
│   │   └── services/         # API service layer
│   ├── public/
│   ├── package.json
│   └── .env.example
├── database/                  # Database setup
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Sample data
└── README.md
```

---

## Key Features

### Student Features

- Register and login with secure JWT authentication
- View dashboard with saved events and buddy requests
- View and edit profile
- Search students by course/interests
- Send/receive study buddy requests
- Browse and bookmark campus events
- Manage saved events

### Admin Features

- Admin login
- Admin dashboard to manage events
- Add, edit, and delete campus events

## Security Implemented

- Password hashing with bcrypt
- JWT token authentication
- Protected frontend routes
- Protected backend middleware routes
- Admin-only authorization middleware
- Input validation on backend
- Parameterized PostgreSQL queries to prevent SQL injection
- Secrets in `.env`

## Demo Accounts

### Student

- Email: `aisha@student.university.edu`
- Password: `Student@123`

### Student 2

- Email: `liam@student.university.edu`
- Password: `Student@123`

### Admin

- Email: `admin@campuslink.edu`
- Password: `Admin@123`
