const mongoose = require('mongoose');




const reviewSchema =  mongoose.Schema({
    recipe_id: { type: String, required: true },
    reviewer_name: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, required: true },
    date_of_review: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);