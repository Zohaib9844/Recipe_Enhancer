const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,   
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description:{
        type:String,
        
    },
    prepTime:{
        type:String,
        required:true,   
    },
    cookTime:{
        type:String,
        required:true,   
    },
    instructions:{
        type:String,
        required:true,   
    },
    ingredients:{
        type:String,
        required:true,   
    },
    r_picture:{
        type:String,
    },
    aiInstructions:{
        type:String,
           
    },
    aiIngredients:{
        type:String,
           
    },
    reviewCounter:{
        type:Number,
    }
    
});

module.exports = mongoose.model('Recipe', recipeSchema);