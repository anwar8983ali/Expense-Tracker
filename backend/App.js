const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');

const connectDB = require('./connect.js');
const ExpressError = require('./utils/ExpressError');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

require('./config/passport')(passport);

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

// Render (and most PaaS hosts) sit behind a reverse proxy. Without this,
// Express doesn't know the original request was HTTPS, which breaks
// secure cookies.
app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  // Set CLIENT_URL in Render's env vars to your Vercel URL,
  // e.g. https://your-app.vercel.app
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: isProduction, // cookie only sent over HTTPS in production
      // Frontend and backend are on different domains in production
      // (Vercel + Render), so the cookie needs sameSite: 'none' to be
      // sent cross-site. Locally, 'lax' is fine and doesn't require HTTPS.
      sameSite: isProduction ? 'none' : 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);

// 404 handler — no route matched
app.use((req, res, next) => {
  next(new ExpressError('Not Found', 404));
});

// Central error handler — every thrown/forwarded error lands here.
// Replaces the repeated try/catch + console.error(err) pattern in every route.
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(statusCode).json({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
