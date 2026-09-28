# CampusConnect

A full-stack MERN app (MongoDB, Express, React, Node.js) for discovering
and tracking student opportunities (internships, hackathons, workshops).

## Project Overview
Students can register, browse opportunities, apply, and track application
status. Admins can create/edit/delete opportunities and update application
statuses. See `Full_Stack_Web_Development.pdf` for the full brief.

## Features
- JWT authentication with bcrypt-hashed passwords
- Role-based access (student / admin) enforced on the backend
- Full CRUD for opportunities (admin only)
- Apply / track applications (students)
- Search & filter on the opportunities page
- Protected frontend routes (`/dashboard`, `/admin`)
- Responsive layout, loading & error states, form validation

## Tech Stack
Frontend: React (Vite), React Router
Backend: Node.js, Express, JWT, bcryptjs
Database: MongoDB (Atlas or local) via Mongoose

## Project Structure
```
campusconnect/
├── client/   → React frontend (Vite)
└── server/   → Node/Express API
```

## Installation & Setup

### 1. MongoDB
Create a free cluster at https://www.mongodb.com/cloud/atlas, or run
MongoDB locally. Get your connection string.

### 2. Backend
```bash
cd server
npm install
cp .env.example .env
# edit .env: paste your MONGO_URI and set a random JWT_SECRET
npm run dev        # or: npm start
```
Visit http://localhost:5000/api/health — you should see:
```json
{ "success": true, "message": "CampusConnect API is running" }
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env   # defaults to http://localhost:5000/api, fine for local dev
npm run dev
```
Visit http://localhost:5173

### 4. Create your first admin user
There's no admin signup form on purpose (so random users can't grant
themselves admin). Register a normal account, then either:
- Manually edit that user's `role` field to `"admin"` in MongoDB Atlas
  (Collections → users → edit document), or
- Temporarily add a one-off script / API call that sets it.

## Environment Variables

**server/.env**
| Variable   | Description                          |
|------------|---------------------------------------|
| MONGO_URI  | MongoDB connection string             |
| JWT_SECRET | Random secret used to sign JWTs       |
| PORT       | Port for the API (default 5000)       |

**client/.env**
| Variable      | Description                    |
|---------------|---------------------------------|
| VITE_API_URL  | Base URL of the backend API     |

## API Endpoints

**Auth**
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — get a JWT

**Opportunities**
- `GET /api/opportunities` — list (public, supports `?search=&mode=`)
- `GET /api/opportunities/:id` — details (public)
- `POST /api/opportunities` — create (admin)
- `PUT /api/opportunities/:id` — update (admin)
- `DELETE /api/opportunities/:id` — delete (admin)

**Applications**
- `POST /api/applications` — apply (student, logged in)
- `GET /api/applications/my` — my applications (student)
- `GET /api/applications` — all applications (admin)
- `PUT /api/applications/:id/status` — update status (admin)

## Demo Link
_Add your deployed frontend/backend URLs here once deployed._

## Future Improvements
- Saved/bookmarked opportunities
- Resume upload
- Email notifications on status change
- Skill-based recommendations
