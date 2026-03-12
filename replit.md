# CampusLink

A full-stack university web app for student engagement, peer connection (study buddies), campus event participation, and study group collaboration.

## Architecture

- **Frontend**: React 18 + React Router v6 + Axios + Bootstrap 5, running on port 3000 (mapped to external port 80)
- **Backend**: Node.js + Express 5, running on port 8000
- **Database**: PostgreSQL (Replit built-in)
- **Auth**: JWT authentication with bcrypt password hashing

## Project Structure

```
frontend/   - React SPA (port 3000)
backend/    - Express REST API (port 8000)
database/   - Original MySQL schema/seed (reference only; PostgreSQL is used)
```

## Key Features

- Student registration & JWT login
- Profile management
- Study buddy requests (send/accept/reject)
- Campus event browsing, bookmarking & RSVP (with attendee count)
- Study Groups (create, join, leave, search)
- In-app Notifications (buddy requests, responses, group joins)
- Admin dashboard for event management

## Development

Two workflows run concurrently:
- **Start application** - React dev server on port 3000
- **Backend API** - Express API server on port 8000

The React app proxies `/api` requests to `http://localhost:8000` via the `proxy` field in `frontend/package.json`.

## Environment Variables

Backend `.env`:
- `PORT=8000`
- `JWT_SECRET` - JWT signing secret
- `DATABASE_URL` - Auto-set by Replit PostgreSQL

Frontend `.env`:
- `HOST=0.0.0.0`
- `DANGEROUSLY_DISABLE_HOST_CHECK=true`

## Database

PostgreSQL (Replit built-in). Tables: `users`, `events`, `buddy_requests`, `saved_events`, `event_rsvps`, `notifications`, `study_groups`, `group_members`.

Demo accounts:
- Student: `aisha@student.university.edu` / `Student@123`
- Student 2: `liam@student.university.edu` / `Student@123`
- Admin: `admin@campuslink.edu` / `Admin@123`

## API Routes

- `/api/auth` - Register, login, current user
- `/api/users` - Profile, search, dashboard
- `/api/events` - Events with RSVP info, save/unsave, RSVP/un-RSVP
- `/api/buddies` - Send/accept/reject buddy requests
- `/api/notifications` - Fetch, mark as read
- `/api/groups` - List, create, join, leave, delete study groups
- `/api/admin` - Admin event CRUD

## Notes

- Originally used MySQL; migrated to PostgreSQL for Replit compatibility
- MySQL `?` placeholders converted to PostgreSQL `$1, $2...` style
- `mysql2` replaced with `pg` package in backend
- JWT payload includes `id`, `email`, `role`, `full_name` for notification messages
