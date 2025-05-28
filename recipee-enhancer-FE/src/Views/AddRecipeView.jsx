import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/HeadFoot/Navbar";
import Footer from "../Components/HeadFoot/Footer";

export default function AddRecipe({ user, loading }) {
    const location = useLocation();
    const navigate = useNavigate();
    const BACKEND_URL = 'http://127.0.0.1:3000';
    
    const [recipeId, setRecipeId] = useState(null);
    const [recipe, setRecipe] = useState({
        name: "",
        description: "",
        prepTime: "",
        cookTime: "",
        instructions: "",
        ingredients: "",
        r_picture: null
    });
    
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    // Check if this is an edit by looking for id in location state
    useEffect(() => {
        const id = location.state?.id;
        console.log("Recipe ID from state:", id);
        
        if (id) {
            setRecipeId(id);
            setIsEditing(true);
            fetchRecipe(id);
        }
    }, [location.state]);

    const fetchRecipe = async (id) => {
        setFormLoading(true);
        try {
            console.log(`Fetching recipe with ID: ${id}`);
            const response = await axios.get(`${BACKEND_URL}/api/get_recipe/${id}`);
            console.log("Recipe data:", response.data);
            
            const recipeData = response.data;
            setRecipe({
                name: recipeData.name || "",
                description: recipeData.description || "",
                prepTime: recipeData.prepTime || "",
                cookTime: recipeData.cookTime || "",
                instructions: recipeData.instructions || "",
                ingredients: recipeData.ingredients || "",
                r_picture: null // Don't set the actual file, just the preview
            });
            
            if (recipeData.r_picture) {
                setPreviewImage(`${BACKEND_URL}/${recipeData.r_picture}`);
            }
            
        } catch (error) {
            console.error("Error fetching recipe:", error);
            setError("Failed to load recipe details");
        } finally {
            setFormLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRecipe(prev => ({
                ...prev,
                r_picture: file
            }));
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError("");
        
        try {
            const formData = new FormData();
            
            // Add all recipe fields to formData
            Object.keys(recipe).forEach(key => {
                if (key === 'r_picture' && recipe[key] !== null) {
                    formData.append(key, recipe[key]);
                } else if (key !== 'r_picture') {
                    formData.append(key, recipe[key]);
                }
            });

            // Add userId to formData if user is logged in
            if (user && user._id) {
                console.log("Adding userId to formData:", user._id);
                formData.append('userId', user._id);
            } else {
                console.error("No user ID available");
                setError("You must be logged in to add a recipe");
                setFormLoading(false);
                return;
            }
            
            let response;
            
            if (isEditing && recipeId) {
                console.log(`Updating recipe with ID: ${recipeId}`);
                console.log("FormData contents:", Object.fromEntries(formData));
                
                response = await axios.put(`${BACKEND_URL}/api/update_recipe/${recipeId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                });
                console.log("Update response:", response.data);
            } else {
                console.log("Creating new recipe");
                console.log("FormData contents:", Object.fromEntries(formData));
                
                response = await axios.post(`${BACKEND_URL}/api/add_recipe`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                });
                console.log("Create response:", response.data);
            }
            
            // Navigate back to home page
            navigate("/");
            
        } catch (error) {
            console.error("Error saving recipe:", error);
            setError(`Failed to ${isEditing ? 'update' : 'create'} recipe: ${error.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar isRecipePage={true} user={user} loading={loading} />
            
            <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEditing ? "Edit Recipe" : "Add New Recipe"}</h1>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <p>{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                                Recipe Name
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                type="text"
                                id="name"
                                name="name"
                                value={recipe.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="col-span-full">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                id="description"
                                name="description"
                                rows="3"
                                value={recipe.description}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="prepTime">
                                Preparation Time
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                type="text"
                                id="prepTime"
                                name="prepTime"
                                value={recipe.prepTime}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 15 minutes"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="cookTime">
                                Cooking Time
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                type="text"
                                id="cookTime"
                                name="cookTime"
                                value={recipe.cookTime}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 30 minutes"
                            />
                        </div>
                        
                        <div className="col-span-full">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="ingredients">
                                Ingredients
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                id="ingredients"
                                name="ingredients"
                                rows="6"
                                value={recipe.ingredients}
                                onChange={handleChange}
                                required
                                placeholder="Enter each ingredient on a new line"
                            />
                        </div>
                        
                        <div className="col-span-full">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="instructions">
                                Instructions
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                id="instructions"
                                name="instructions"
                                rows="8"
                                value={recipe.instructions}
                                onChange={handleChange}
                                required
                                placeholder="Enter step-by-step instructions"
                            />
                        </div>
                        
                        <div className="col-span-full">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="r_picture">
                                Recipe Image
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                type="file"
                                id="r_picture"
                                name="r_picture"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {previewImage && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                                    <img 
                                        src={previewImage} 
                                        alt="Recipe preview" 
                                        className="w-full max-h-64 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formLoading}
                            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {formLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Recipe' : 'Save Recipe')}
                        </button>
                    </div>
                </form>
            </main>
            
            <Footer />
        </div>
    );
}