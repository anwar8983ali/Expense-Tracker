# Expense Tracker

A full-stack expense tracking app with authentication, category-based expense
logging, spending charts, and OTP-based password reset.

**Live app:** https://expense-tracker-theta-eight-96.vercel.app

## Tech stack

**Backend:** Node.js, Express, MongoDB (Mongoose), Passport.js (local
session-based auth), express-session with MongoDB session store,
Joi (validation), Helmet + express-rate-limit (security), Nodemailer (OTP
emails).

**Frontend:** React (Vite), Axios, Recharts-based spending chart.

## Features

- Email/password signup and login with server-side sessions (cookie-based,
  not JWT)
- Forgot-password and in-account password change, both via a 6-digit
  emailed OTP with a 10-minute expiry
- Add, edit, and delete expenses, scoped per user (an `isExpenseOwner`
  check prevents editing/deleting another user's expense by guessing an id)
- Dashboard with total spend, this-month spend, transaction count, and a
  spending trend chart
- Input validation on every write route (Joi schemas), rate limiting on
  auth routes, Helmet security headers

## Project structure

```
ExpenseTracker/
├── backend/
│   ├── App.js                 # entry point: middleware, routes, error handler
│   ├── connect.js             # MongoDB connection
│   ├── config/
│   │   ├── passport.js        # passport-local strategy
│   │   └── email.js           # Nodemailer transport
│   ├── controllers/           # route handler logic
│   ├── middleware/
│   │   ├── authMiddleware.js  # ensureAuthenticated, isExpenseOwner
│   │   └── validateMiddleware.js
│   ├── models/                # Mongoose schemas (User, Expense)
│   ├── routes/                # Express routers
│   ├── schemas/                # Joi validation schemas
│   └── utils/
│       ├── catchAsync.js      # wraps async handlers so errors reach next()
│       └── ExpressError.js    # custom error class with a statusCode
└── frontend/
    └── src/
        ├── api/axios.js       # single axios instance, baseURL from env
        ├── context/AuthContext.jsx
        ├── HomePage.jsx / ExpenseList.jsx / ExpenseChart.jsx / ...
        └── ...
```

## Local setup

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod`, or a free MongoDB Atlas cluster)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords)
  (or any other SMTP credentials) for sending OTP emails

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values, see below
npm run dev             # nodemon, restarts on file changes
# or: npm start
```

Backend runs on `http://localhost:8080` by default.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env    # defaults to http://localhost:8080, usually fine as-is
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Environment variables

### `backend/.env`

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Long random string, e.g. `openssl rand -hex 32` |
| `PORT` | Port to run the server on (default `8080`) |
| `EMAIL_USER` | SMTP/Gmail address used to send OTP emails |
| `EMAIL_PASS` | SMTP/Gmail app password |
| `CLIENT_URL` | Deployed frontend URL, used for CORS in production. Leave blank for local dev. |
| `NODE_ENV` | Set to `production` when deployed — controls cookie `secure`/`sameSite` behavior |

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL. `http://localhost:8080` locally, your Render URL in production |

Neither `.env` file is committed — see `.env.example` in each folder for the
full list with comments.

## API reference

All routes are prefixed with `/api`. Routes marked 🔒 require an active
session (`ensureAuthenticated`).

### Auth — `/api/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Create an account |
| POST | `/login` | Log in, starts a session |
| POST | `/logout` | Destroy the session |
| GET | `/status` | Check current login state |
| POST | `/forgot-password` | Request a password-reset OTP by email |
| POST | `/reset-password` | Reset password using the OTP |

### Expenses — `/api/expenses` 🔒
| Method | Route | Description |
|---|---|---|
| GET | `/` | List the logged-in user's expenses |
| POST | `/` | Create a new expense |
| PUT | `/:id` | Update an expense (must be owned by the logged-in user) |
| DELETE | `/:id` | Delete an expense (must be owned by the logged-in user) |

### Users — `/api/users` 🔒
| Method | Route | Description |
|---|---|---|
| POST | `/request-password-otp` | Request an OTP to change password while logged in |
| POST | `/reset-password-with-otp` | Change password using that OTP |

All auth and password-reset routes are rate-limited to 10 requests per
15 minutes per IP.

## Deployment

Deployed as two separate services: **backend on Render**, **frontend on
Vercel**, database on **MongoDB Atlas**.

1. **MongoDB Atlas** — create a free cluster, whitelist `0.0.0.0/0` under
   Network Access (Render's free tier has no static IP), copy the
   connection string into `MONGO_URI`.
2. **Backend → Render** — New Web Service, root directory `backend`,
   build command `npm install`, start command `node App.js`. Add all
   backend env vars listed above, with `NODE_ENV=production`.
3. **Frontend → Vercel** — New Project, root directory `frontend`, Vite
   auto-detected. Add `VITE_API_URL` pointing at the Render URL.
4. **Connect them** — set `CLIENT_URL` on Render to the Vercel URL. This
   is required for CORS and for cross-origin session cookies
   (`sameSite: 'none'`, `secure: true`) to work.
5. Redeploy both after setting env vars — Vite bakes `VITE_API_URL` in at
   build time, so changing it in the dashboard alone isn't enough.

Render's free tier spins down after 15 minutes idle; the first request
after that can take 30–60 seconds to wake back up.

## Security notes

- Passwords are hashed with bcrypt before storage, never stored or logged
  in plaintext
- Sessions are stored server-side in MongoDB (`connect-mongo`), not JWTs
  in localStorage — no token to steal via XSS
- Session cookies are `httpOnly` (inaccessible to JS) and `secure` in
  production (HTTPS only)
- Forgot-password responses are intentionally generic ("if this email is
  registered...") so the API doesn't leak which emails have accounts
- All write endpoints validate input server-side with Joi — the frontend
  form validation is a UX nicety, not the actual security boundary
