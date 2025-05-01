import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AddRecipe() {
    const BACKEND_URL = 'http://127.0.0.1:3000';
    const navigate = useNavigate();
    const location = useLocation();
    const isUpdating = location.state?.id !== undefined;
    
    // State for all form inputs
    const [recipeData, setRecipeData] = useState({
        name: '',
        userId: '',
        description: '',
        prepTime: '',
        cookTime: '',
        ingredients: '',
        instructions: '',
        r_picture: ""
    });

    // Initialize form with recipe data if updating
    useEffect(() => {
        if (location.state?.id) {
            axios.get(`http://127.0.0.1:3000/api/get_recipe/${location.state.id}`)
                .then(response => {
                    setRecipeData(prev => ({
                        ...prev,
                        ...response.data,
                        r_picture: response.data.r_picture || ""  // keep as string, only used for preview
                    }));
                })
                .catch(error => {
                    console.error('Error fetching recipe:', error);
                });
        }
    }, [location.state?.id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', recipeData.name);
        formData.append('description', recipeData.description);
        formData.append('prepTime', recipeData.prepTime);
        formData.append('cookTime', recipeData.cookTime);
        formData.append('ingredients', recipeData.ingredients);
        formData.append('instructions', recipeData.instructions);
        if (recipeData.r_picture instanceof File) {
            formData.append('r_picture', recipeData.r_picture);
        }
        try {
            if (isUpdating) {
                // If updating, send PUT request with recipe ID
                await axios.put(`http://127.0.0.1:3000/api/update_recipe/${location.state.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // If creating new, send POST request
                const response = await axios.post(
                    'http://127.0.0.1:3000/api/add_recipe', 
                    formData, 
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );
            }
            navigate('/'); // Redirect to home page after successful addition/update
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    {isUpdating ? 'Update Recipe' : 'Create New Recipe'}
                </h2>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Recipe Name
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name"
                                value={recipeData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter recipe name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-2">
                                    Prep Time (minutes)
                                </label>
                                <input 
                                    type="number" 
                                    name="prepTime" 
                                    id="prepTime"
                                    value={recipeData.prepTime}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="30"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-2">
                                    Cook Time (minutes)
                                </label>
                                <input 
                                    type="number" 
                                    name="cookTime" 
                                    id="cookTime"
                                    value={recipeData.cookTime}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="45"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea 
                                name="description" 
                                id="description"
                                value={recipeData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Write a brief description of your recipe"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
                                Ingredients
                            </label>
                            <textarea 
                                name="ingredients" 
                                id="ingredients"
                                value={recipeData.ingredients}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="List your ingredients (one per line)"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                                Instructions
                            </label>
                            <textarea 
                                name="instructions" 
                                id="instructions"
                                value={recipeData.instructions}
                                onChange={handleInputChange}
                                rows="6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Write step-by-step instructions"
                                required
                            />
                        </div>

                        <div>
                        {recipeData.r_picture && (
                                <img 
                                src={
                                  recipeData.r_picture instanceof File
                                    ? URL.createObjectURL(recipeData.r_picture)
                                    : `${BACKEND_URL}/${recipeData.r_picture}`
                                }
                              />
                              
                            )}


                            <label htmlFor="r_picture" className="block text-sm font-medium text-gray-700 mb-2">
                                Recipe Image
                            </label>
                            <input 
                                type="file"
                                name="r_picture"
                                id="r_picture"
                                accept="image/*"
                                onChange={(e) => setRecipeData(prev => ({
                                    ...prev,
                                    r_picture: e.target.files[0]
                                }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-6">
                        <button 
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            {isUpdating ? 'Update Recipe' : 'Add Recipe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}