const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipes');
const upload = require('../multerConfig');
const axios = require('axios');

router.post('/add_recipe', upload.single('r_picture'), async (req, res) => {
    try {
        const filePath = req.file ? req.file.path : null;
        const newRecipe = new Recipe({
            ...req.body,
            userId: req.user?._id,
            r_picture: filePath
        });
        const result = await newRecipe.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

router.get('/get_recipies', async (req, res)=>{
    try{
        const recipes = await Recipe.find();
        res.status(201).json(recipes);
    } catch(err) {
        console.error('Error getting the data', err);
        res.status(400).json({ message : err.message });    
    }
});

router.get('/get_recipe/:_id', async (req, res)=>{
    try{
        const recipe = await Recipe.findById(req.params._id);
        res.status(201).json(recipe);
    } catch(err) {
        console.error('Error getting the data', err);
        res.status(400).json({ message : err.message });    
    }
});

router.put('/update_recipies/:_id', upload.single('r_picture'), async (req, res) => {
    try {
        const updatedRecipe = {
            ...req.body,
        };
        if (req.file) {
            updatedRecipe.r_picture = req.file.path;
        }
      
        const result = await Recipe.findByIdAndUpdate(req.params._id, updatedRecipe,  {new:true});
        if(!result){
            return res.status(404).json({message: "not found"});
        }
        return res.json(result);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Error updating recipe' });
    }
});

router.delete('/delete_recipies/:_id', async (req, res)=>{
    try {
        const result = await Recipe.findByIdAndDelete(req.params._id);
        if(!result){
            return res.status(404).json({message: "not found"});
        }
        return res.json(result);
    } catch(err) {
        console.error('Error deleting the data', err);
        res.status(400).json({ message : err.message });    
    }
});

const API_KEY = process.env.DEEPSEEK_API_KEY;
if (!API_KEY) throw new Error('🚨 Missing DEEPSEEK_API_KEY env var');

router.post('/ai_modify/', async (req, res) => {
    const { text, recipeId } = req.body;
    if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Invalid `text` in body' });
    }
    if (!recipeId) {
        return res.status(400).json({ error: 'Invalid `recipeId` in body' });
    }

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const { data } = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'deepseek/deepseek-r1:free',   // pick the right one
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are a professional chef, expert in all styles of cooking styles and dishes. Below I shall provide you with some ingredients and instructions on some particular recipe, alongside some reviews. What I want you to do is to get those instructions and ingredients and modify them based on the reviews to make the dish perfect. Return the modified ingredients and instructions in the following JSON format: { "ingredients": ["ingredient1", "ingredient2", ...], "instructions": ["instruction1", "instruction2", ...] }. Do not include any extra text or explanations.' 
                    },
                    { role: 'user', content: text.trim() },
                ],
                temperature: 0.5,
            },
            {
                timeout: 10_000,    // 10 sec max
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );

        const choice = data.choices?.[0]?.message?.content;
        if (!choice) throw new Error('No completion returned');

        // Log the raw response for debugging
        console.log('Raw AI Response:', choice);

        // Strip Markdown backticks and parse the response
        try {
            const strippedResponse = choice.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedResponse = JSON.parse(strippedResponse);

            // Update the recipe with AI response and reset reviewCounter
            recipe.aiIngredients = parsedResponse.ingredients.join('\n');
            recipe.aiInstructions = parsedResponse.instructions.join('\n');
            recipe.reviewCounter = 0;

            // Save the updated recipe
            await recipe.save();
            console.log('Recipe saved with AI modifications:', recipe);

            return res.json(parsedResponse);
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            return res.status(500).json({
                error: 'Invalid AI response format',
                details: 'The AI response could not be parsed as JSON.',
            });
        }
    } catch (err) {
        console.error('🔗 OpenRouter error:', err.response?.data || err.message);
        const status = err.response?.status || 502;
        return res.status(status).json({
            error: 'OpenRouter failure',
            details: err.response?.data || err.message,
        });
    }
});

module.exports = router;