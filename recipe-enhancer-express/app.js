require('dotenv').config({ debug: true })
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const router = require('./routes/recipe');
const rrouter = require('./routes/review');
const arouter = require('./routes/auth');
const app = express();
const helmet     = require('helmet'); 
const rateLimit  = require('express-rate-limit');
const morgan     = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const PORT = process.env.PORT || 3000;

app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("DB connected"))
.catch(err => console.log(err));

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

app.use(session({
    store: store,
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: 'lax',
        httpOnly: true
    }
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send("API is running"));

app.use('/api', router);   
app.use('/review', rrouter); 
app.use('/auth', arouter);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('tiny'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
