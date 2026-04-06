# Finance Data Processing and Access Control Backend

Backend assignment implementation for a finance dashboard system using Node.js, Express.js, JWT, MongoDB, and Mongoose.

## What this project covers

- JWT authentication with HTTP-only cookies and active or inactive user enforcement
- Role based access control for `viewer`, `analyst`, and `admin`
- User management APIs for admins
- Financial record CRUD with filtering, search, and pagination
- Dashboard summary API with totals, category wise aggregation, recent activity, and trends
- Centralized validation and error handling
- Service layer to keep business logic out of controllers
- Seed script for demo users and sample finance data

## Role matrix

- `viewer`: can authenticate, view own profile, and access dashboard summaries
- `analyst`: all viewer permissions plus read financial records and insights
- `admin`: full access to users and financial records plus dashboard summaries

## Assumptions

- User registration is admin controlled, so there is no public signup endpoint
- Viewers can access only summary level dashboard data, not raw records
- Analysts can read records but cannot create, update, or delete them
- Admins are responsible for user lifecycle and all record writes

## Tech stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for stateless auth
- Cookie based session transport using `cookie-parser`
- Zod for request validation

## Setup

1. Copy `.env.example` to `.env`
2. Set `MONGODB_URI` and `JWT_SECRET`
3. Optionally configure cookie behavior:

## User Creation Flow

This system does not expose public user signup.

User creation is admin-controlled:
- The initial admin user is created through the seed script
- That admin logs in first
- New users are then created through `POST /api/users`

This keeps user onboarding under admin control and matches the role-based access model of the system.

```env
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

4. Install dependencies:

```bash
npm install
```

5. Seed demo data if needed:

```bash
npm run seed
```

6. Start the server:

```bash
npm run dev
```

The API runs on `http://localhost:4000` by default.

## Default seeded users

- `admin@example.com` / `Admin@12345`
- `analyst@example.com` / `Analyst@12345`
- `viewer@example.com` / `Viewer@12345`

## API overview

### Health

- `GET /health`

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users

- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:userId`

### Records

- `GET /api/records`
- `GET /api/records/:recordId`
- `POST /api/records`
- `PATCH /api/records/:recordId`
- `DELETE /api/records/:recordId`

Supported record filters on `GET /api/records`:

- `type=income|expense`
- `category=<value>`
- `startDate=<ISO date>`
- `endDate=<ISO date>`
- `search=<notes text>`
- `page=<number>`
- `limit=<number>`
- `sortBy=date|amount|category|createdAt`
- `sortOrder=asc|desc`

### Dashboard

- `GET /api/dashboard/summary`

Supported dashboard query params:

- `startDate=<ISO date>`
- `endDate=<ISO date>`
- `trendBy=week|month`
- `recentLimit=<1-20>`

## Example requests

### Login

```bash
curl --request POST http://localhost:4000/api/auth/login \
  --header "Content-Type: application/json" \
  --cookie-jar cookies.txt \
  --data '{"email":"admin@example.com","password":"Admin@12345"}'
```

The login endpoint sets the JWT in an HTTP-only `accessToken` cookie. Use the saved cookie for protected requests:

```bash
curl --request GET http://localhost:4000/api/auth/me \
  --cookie cookies.txt
```

### Create a user

```bash
curl --request POST http://localhost:4000/api/users \
  --cookie cookies.txt \
  --header "Content-Type: application/json" \
  --data '{"name":"Asha","email":"asha@example.com","password":"Secure@123","role":"analyst","status":"active"}'
```

### Create a financial record

```bash
curl --request POST http://localhost:4000/api/records \
  --cookie cookies.txt \
  --header "Content-Type: application/json" \
  --data '{"amount":2500,"type":"income","category":"Bonus","date":"2026-04-01","notes":"Quarterly bonus"}'
```

### Get dashboard summary

```bash
curl --request GET "http://localhost:4000/api/dashboard/summary?trendBy=month&recentLimit=5" \
  --cookie cookies.txt
```

## Error handling

- Invalid input returns `400`
- Authentication failures return `401`
- Unauthorized actions return `403`
- Missing resources return `404`
- Duplicate user creation returns `409`

## Project structure

```text
src/
  config/
  constants/
  controllers/
  middlewares/
  models/
  routes/
  services/
  scripts/
  utils/
  validators/
```

## Submission notes

This implementation favors clarity over unnecessary abstraction. The system is split into focused route, controller, model, and middleware layers so role behavior, validation, and summary aggregation stay easy to inspect during evaluation.
# finance-dashboard-backend
