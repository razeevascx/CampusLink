<div align="center">

# CAMPUSLINK

_Connecting Students Through Study, Events, and Community Engagement_

<br/>

<img src="https://img.shields.io/badge/node.js-18.x-brightgreen?style=for-the-badge" height="30"/>
<img src="https://img.shields.io/github/languages/count/razeev.asnx/CampusLink?label=languages&color=orange&style=for-the-badge" height="30"/>
<img src="https://img.shields.io/github/last-commit/razeev.asnx/CampusLink?label=last%20commit&color=blue&style=for-the-badge" height="30"/>

<br/>

##

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; width: 100%;">
   <img src="https://img.shields.io/badge/-Express.js-000000?style=for-the-badge&logo=express" height="36"/>
   <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" height="36"/>
   <img src="https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" height="36"/>
   <img src="https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" height="36"/>
   <img src="https://img.shields.io/badge/-Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" height="36"/>
   <img src="https://img.shields.io/badge/-Bcrypt-333333?style=for-the-badge" height="36"/>
</div>

</div>

## Project Overview

CampusLink is a full-stack web application designed to enhance student engagement and community building at universities. It enables students to discover campus events, connect with study buddies, form study groups, and stay updated with campus notifications—all in one unified platform.

## Key Features

- **Student Authentication** - Secure JWT-based registration and login
- **Event Discovery** - Browse and discover campus events with filtering and bookmarking
- **Study Buddy Connection** - Find and connect with other students
- **Study Groups** - Create and manage study groups by subject
- **Real-time Notifications** - Stay updated with event and group notifications
- **Admin Dashboard** - Comprehensive administration panel for managing events and users
- **Role-based Access** - Separate student and admin user roles with different permissions

## Tech Stack

- **Frontend:** React 18.3+, React Router v6, Bootstrap 5, Axios
- **Backend:** Node.js 18+, Express.js 5.2+, PostgreSQL
- **Authentication:** JWT (JSON Web Tokens), bcrypt password hashing
- **Development:** npm, nodemon for hot-reload

## Project Structure

```
CampusLink/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── server.js          # Main server entry point
│   │   ├── seed.js            # Database seeding script
│   │   ├── config/
│   │   │   └── db.js          # Database connection config
│   │   ├── controllers/       # Business logic handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── eventController.js
│   │   │   ├── buddyController.js
│   │   │   ├── groupController.js
│   │   │   ├── notificationController.js
│   │   │   └── adminController.js
│   │   ├── routes/            # API route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   ├── buddyRoutes.js
│   │   │   ├── groupRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   └── adminRoutes.js
│   │   └── middleware/        # Authentication & validation
│   ├── package.json
│   └── .env.example
├── frontend/                  # React application
│   ├── public/
│   │   └── index.html         # Main HTML file
│   ├── src/
│   │   ├── App.js            # Root component
│   │   ├── index.js          # React entry point
│   │   ├── styles.css        # Global styles
│   │   ├── components/       # Reusable components
│   │   │   ├── AdminRoute.js
│   │   │   ├── Footer.js
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── NotificationBell.js
│   │   ├── context/          # React context
│   │   │   └── AuthContext.js
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── EventsPage.js
│   │   │   ├── AddEventPage.js
│   │   │   ├── EditEventPage.js
│   │   │   ├── SavedEventsPage.js
│   │   │   ├── StudyBuddiesPage.js
│   │   │   ├── StudyGroupsPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── EditProfilePage.js
│   │   │   ├── AdminDashboardPage.js
│   │   │   └── AdminLoginPage.js
│   │   └── services/         # API service layer
│   │       └── api.js
│   ├── package.json
│   └── .env.example
├── database/                  # Database setup & seeds
│   ├── schema.sql            # PostgreSQL schema
│   └── seed.sql              # Sample data
├── .env.example              # Environment variables template
└── README.md

```

## Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 12.x or higher

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/razeev.asnx/CampusLink.git
   ```

2. **Navigate to Project**

   ```bash
   cd CampusLink
   ```

3. **Setup Database**

   ```bash
   psql -U postgres -c "CREATE DATABASE campuslink;"
   ```

4. **Import Schema**

   ```bash
   psql -U postgres -d campuslink < database/schema.sql
   ```

5. **Seed Data (Optional)**

   ```bash
   psql -U postgres -d campuslink < database/seed.sql
   ```

6. **Setup Backend**

   ```bash
   cd backend
   npm install
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

7. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Verification

- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- Register a new account or use demo credentials
- Explore the dashboard, events, and study buddies features

## Demo Accounts

**Student:**

- Email: `aisha@student.university.edu`
- Password: `Student@123`

**Admin:**

- Email: `admin@campuslink.edu`
- Password: `Admin@123`

## Support and Community

- **GitHub Issues:** https://github.com/razeev.asnx/CampusLink/issues
- **Report Bugs:** Create a new issue with detailed steps and screenshots
- **Suggest Features:** Open a feature request with problem description and proposed solution
