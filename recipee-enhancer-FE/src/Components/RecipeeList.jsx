import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useEffect } from "react";

export default function RecipeList({ Recipies = [], onDelete, user }) {
    const BACKEND_URL = 'http://127.0.0.1:3000';
    const navigate = useNavigate();

    const handleUpdate = (_id) => {
        navigate('/addrecipe', { state: { id: _id } });
    };

    // Function to check reviewCounter and trigger AI modify
    const checkAndModifyRecipe = async (recipe) => {
        if (recipe.reviewCounter && recipe.reviewCounter >= 3) {
            try {
                // Fetch reviews for the recipe
                const reviewsResponse = await axios.get(`${BACKEND_URL}/review/get_reviews/${recipe._id}`);
                const reviews = reviewsResponse.data;

                // Prepare the text for AI modify
                const text = `ingredients: ${recipe.ingredients}. Instructions: ${recipe.instructions}. Reviews: ${reviews.map(review => review.comment).join(', ')}. Can you adjust the recipe?`;

                // Call the AI modify endpoint
                await axios.post(`${BACKEND_URL}/api/ai_modify/`, {
                    text: text,
                    recipeId: recipe._id
                }); 

                console.log(`AI modify triggered for recipe: ${recipe.name}`);
            } catch (error) {
                console.error('Error triggering AI modify:', error);
            }
        }
    };

    // Check each recipe when the component mounts or when the recipes change
    useEffect(() => {
        if (Recipies && Recipies.length > 0) {
            Recipies.forEach(recipe => {
                if (recipe) checkAndModifyRecipe(recipe);
            });
        }
    }, [Recipies]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Recipies.map((recipe) => (
                <div key={recipe._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <Link to={`/showrecipe/${recipe._id}`}>
                        <div className="relative h-48 w-full">
                            {recipe.r_picture ? (
                                <img 
                                    src={`${BACKEND_URL}/${recipe.r_picture}`}
                                    alt={recipe.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.log("Image failed to load:", e);
                                        e.target.src = "https://placehold.co/400x300";
                                    }}
                                />
                            ) : (
                                <img 
                                    src="https://placehold.co/400x300"
                                    alt={recipe.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                                #{recipe._id.substring(0, 6)}
                            </div>
                        </div>
                    </Link>
                    
                    <div className="p-6">
                        <Link to={`/showrecipe/${recipe._id}`}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {recipe.name}
                            </h3>
                        </Link>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                            {recipe.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                            <button 
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-300"
                                onClick={() => navigate(`/reviews/${recipe._id}`)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="CurrentColor">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                                Reviews
                            </button>
                            
                            <div className="flex items-center space-x-2">
                                <button 
                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                    onClick={() => handleUpdate(recipe._id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button 
                                    className="text-red-600 hover:text-red-800 transition-colors duration-300"
                                    onClick={() => onDelete(recipe._id)}
                                >
                                    <svg xmlns="http://www.w3.org/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {Recipies.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-xl shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-500 text-lg">No recipes found</p>
                    <button 
                        className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-300"
                        onClick={() => navigate('/addrecipe')}
                    >
                        Add Your First Recipe
                    </button>
                </div>
            )}
        </div>
    );
}