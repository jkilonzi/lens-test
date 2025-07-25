const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const verifyToken = require('./middleware/authenticateToken');
const { csrfProtection, csrfTokenHandler } = require('./middleware/csrfMiddleware');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// ✅ Configure CORS to allow only your frontend (NO "*")
const allowedOrigins = [process.env.NEXTAUTH_URL || "http://localhost:3000"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ CSRF token endpoint (to fetch CSRF token from frontend)
app.get('/csrf-token', csrfProtection, csrfTokenHandler);

// ✅ Apply CSRF & Auth only to protected WRITE routes in route files (not globally here)
app.use('/account', verifyToken, userRoutes);
app.use('/events', csrfProtection, verifyToken, eventRoutes);


// ✅ Public routes (e.g., login, signup)
app.use('/auth', authRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Server is Active and Running!');
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
