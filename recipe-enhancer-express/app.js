// app.js - UPDATED VERSION
require('dotenv').config({ debug: true })
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const router = require('./routes/recipe');
const rrouter = require('./routes/review');
const arouter = require('./routes/auth');
const app = express();
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');

const PORT = process.env.PORT || 3000;

// Apply security middleware early
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:5173"],
      // Add other directives as needed for your application
    }
  }
}));

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);
app.use('/auth/', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(morgan('tiny'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

// Configure CORS properly
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure session store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24, // 1 day
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
});

// Handle store errors
store.on('error', function(error) {
  console.error('Session store error:', error);
});

// Configure express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send("API is running"));

// Routes
app.use('/api', router);   
app.use('/review', rrouter); 
app.use('/api/auth', arouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An error occurred on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));