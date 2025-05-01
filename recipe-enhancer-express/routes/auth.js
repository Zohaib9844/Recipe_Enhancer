const express = require('express');
const router = express.Router();
require('dotenv').config();
require('../config/passport');
const passport = require('passport');
const cookie_session = require('cookie-session');

router.use(passport.initialize());
router.use(passport.session());

router.get('/api/auth/google', passport.authenticate("google", { scope: ["profile", "email"] }));

router.get('/api/auth/google/callback', passport.authenticate('google', {
    failureRedirect: "/login",
    successRedirect: process.env.CLIENT_URL || "http://localhost:5173"
}));


router.get('/api/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json(req.user);
});

router.get('/api/auth/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;