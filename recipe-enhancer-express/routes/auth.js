const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized access' });
};

// Google OAuth login route - match this with your frontend URL
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

// Google OAuth callback  - must match exactly what's in Google console
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: process.env.CLIENT_URL + '/login?error=true', 
    failureMessage: true 
  }),
  (req, res) => {
    // Successful authentication
    res.redirect(process.env.CLIENT_URL);
  }
);

// User info endpoint - protected
router.get('/me', isAuthenticated, (req, res) => {
  // Return only necessary user information
  const { _id, name, email, profilePicture } = req.user;
  res.json({ _id, name, email, profilePicture });
});

// Update logout endpoint to accept POST and handle API response
router.post('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return res.status(500).json({ error: 'Logout failed' }); 
    }
    // Return a JSON response for API calls
    res.status(200).json({ success: true, message: 'Logout successful' });
  });
});

// Keep the GET endpoint for backwards compatibility
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { 
      return res.status(500).json({ error: 'Logout failed' }); 
    }
    res.redirect(process.env.CLIENT_URL + '/login');
  });
});

// Auth status check
router.get('/status', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
});

module.exports = router;