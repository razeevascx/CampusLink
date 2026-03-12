# CampusLink: Secure Study Buddy and Campus Events Web App

CampusLink is a full-stack university MVP focused on student engagement, peer connection, and campus participation.

## Tech Stack
- Frontend: React + React Router + Axios + Bootstrap
- Backend: Node.js + Express
- Database: MySQL
- Security: bcrypt password hashing, JWT authentication, protected routes, role-based admin authorization

## Project Structure

```
CampusLink/
	backend/
		package.json
		.env.example
		src/
			server.js
			config/
				db.js
			controllers/
				adminController.js
				authController.js
				buddyController.js
				eventController.js
				userController.js
			middleware/
				authMiddleware.js
				validation.js
			routes/
				adminRoutes.js
				authRoutes.js
				buddyRoutes.js
				eventRoutes.js
				userRoutes.js
	frontend/
		package.json
		.env.example
		public/
			index.html
		src/
			App.js
			index.js
			styles.css
			components/
				AdminRoute.js
				Footer.js
				Navbar.js
				ProtectedRoute.js
			context/
				AuthContext.js
			pages/
				AddEventPage.js
				AdminDashboardPage.js
				AdminLoginPage.js
				DashboardPage.js
				EditEventPage.js
				EditProfilePage.js
				EventsPage.js
				HomePage.js
				LoginPage.js
				ProfilePage.js
				RegisterPage.js
				SavedEventsPage.js
				StudyBuddiesPage.js
			services/
				api.js
	database/
		schema.sql
		seed.sql
	.env.example
	README.md
```

## Setup Instructions

### 1. MySQL Setup
1. Create a MySQL database and import schema:
	 - Run `database/schema.sql`
2. Seed sample data:
	 - Run `database/seed.sql`

### 2. Backend Setup
1. Go to backend folder:
	 - `cd backend`
2. Install dependencies:
	 - `npm install`
3. Create environment file:
	 - Copy `.env.example` to `.env`
4. Start backend server:
	 - `npm run dev`

Backend runs on `http://localhost:5000`

### 3. Frontend Setup
1. Go to frontend folder:
	 - `cd frontend`
2. Install dependencies:
	 - `npm install`
3. Create environment file:
	 - Copy `.env.example` to `.env`
4. Start frontend app:
	 - `npm start`

Frontend runs on `http://localhost:3000`

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
- Parameterized MySQL queries to prevent SQL injection
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