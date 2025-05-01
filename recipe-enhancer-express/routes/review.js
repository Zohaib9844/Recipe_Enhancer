const express = require('express');
const router = express.Router();
const Review = require('../models/reviews');
const Recipe = require('../models/recipes');
const axios = require('axios');

// GET /api/get_reviews/:_id
router.get('/get_reviews/:_id', async (req, res) => {
    try {
        const result = await Review.find({ recipe_id: req.params._id });
        res.status(200).json(result); // Use 200 for successful GET requests
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Failed to fetch reviews" }); // Send error response
    }
});

// POST /api/add_review/
router.post('/add_review/', async (req, res) => {
    try {
        const {recipe_id, ...reviewData} = req.body;
        const review = new Review(req.body);

        // Increment the reviewCounter in the associated recipe
        const recipe = await Recipe.findById(recipe_id);
        if (recipe) {
            recipe.reviewCounter = (recipe.reviewCounter || 0) + 1;
            await recipe.save();
        }
        const result = await review.save(); // Use save() to save the review
        res.status(201).json(result); // Use 201 for successful creation
    
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ error: "Failed to add review" }); // Send error response
    }
});

module.exports = router;