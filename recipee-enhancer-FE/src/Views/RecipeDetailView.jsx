import { useEffect, useState } from 'react';
import Navbar from '../Components/HeadFoot/Navbar';
import Footer from '../Components/HeadFoot/Footer';
import axios from "axios";
import { useParams } from 'react-router-dom';

export default function RecipeDetailView() {
    const BACKEND_URL = 'http://127.0.0.1:3000';
    const [recipe, setrecipe] = useState({
        ingredients: [],
        instructions: [],
        aiIngredients: [],
        aiInstructions: [],
        r_picture: '',
        name: '',
        description: '',
        prepTime: '',
        cookTime: '',
    });
    const {id} = useParams();
    console.log(recipe);

    // State for dropdown selections
    const [selectedIngredientVersion, setSelectedIngredientVersion] = useState('user');
    const [selectedInstructionVersion, setSelectedInstructionVersion] = useState('user');

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/get_recipe/${id}`).then(response => {
            const data = response.data;
            data.ingredients = data.ingredients ? data.ingredients.split('\n') : [];
            data.instructions = data.instructions ? data.instructions.split('\n') : [];
            data.aiIngredients = data.aiIngredients ? data.aiIngredients.split('\n') : [];
            data.aiInstructions = data.aiInstructions ? data.aiInstructions.split('\n') : [];
            setrecipe(data);
        }).catch(err => {
            console.log(err);
        });
    }, [id]);
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="relative h-96">
                        <img 
                            src={recipe.r_picture ? `${BACKEND_URL}/${recipe.r_picture}` : "https://placehold.co/400x300"}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h1 className="text-4xl font-bold mb-2">{recipe.name}</h1>
                            <p className="text-lg opacity-90 mb-4">{recipe.description}</p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="ml-1">{recipe.rating}</span>
                                    <span className="ml-1 text-sm">({recipe.reviews} reviews)</span>
                                </div>
                                <span>•</span>
                                <span>By {recipe.author}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recipe Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-gray-500 text-sm">Prep Time</div>
                        <div className="text-lg font-semibold">{recipe.prepTime}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-gray-500 text-sm">Cook Time</div>
                        <div className="text-lg font-semibold">{recipe.cookTime}</div>
                    </div>
                </div>

                {/* Ingredients Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 p-6">
                    <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Select Ingredients Version:
                        </label>
                        <div className="relative">
                            <select
                                value={selectedIngredientVersion}
                                onChange={(e) => setSelectedIngredientVersion(e.target.value)}
                                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="user">Your Ingredients</option>
                                <option value="ai">AI Ingredients</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {(selectedIngredientVersion === 'user' ? recipe.ingredients : recipe.aiIngredients).map((ingredient, index) => (
                            <li key={index} className="flex items-center space-x-3">
                                <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                                <span>{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Instructions Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 p-6">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Select Instructions Version:
                        </label>
                        <div className="relative">
                            <select
                                value={selectedInstructionVersion}
                                onChange={(e) => setSelectedInstructionVersion(e.target.value)}
                                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="user">Your Instructions</option>
                                <option value="ai">AI Instructions</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 极 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <ol className="space-y-6">
                        {(selectedInstructionVersion === 'user' ? recipe.instructions : recipe.aiInstructions).map((instruction, index) => (
                            <li key={index} className="flex space-x-4">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold">
                                    {index + 1}
                                </span>
                                <p className="text-gray-600 mt-1">{instruction}</p>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-300 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Save Recipe
                    </button>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        Write Review
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}