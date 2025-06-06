import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar({ isRecipePage, onAddClick, user, loading }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleAddClick = () => {
        if (isRecipePage) {
            navigate("/addrecipe");
        } else {
            onAddClick?.();
        }
    };

    const handleLogout = async () => {
        try {
            // First set the user to null in the state
            setUser(null);
            
            // Then make the logout request
            await axios.post("http://localhost:3000/api/auth/logout", {}, {
                withCredentials: true,
            });
            
            // Navigate programmatically instead of relying on server redirect
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // If logout fails, try local navigation anyway
            navigate("/login");
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <div className="text-xl font-semibold text-gray-800">
                            <Link to="/" className="hover:text-amber-600 transition-colors">Recipe Enhancer</Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link to="/" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 transition-all">
                                Recipes
                            </Link>
                            
                            <button 
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg 
                                hover:bg-indigo-700 transition-colors duration-300 shadow-sm cursor-pointer
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                                active:bg-indigo-800"
                                onClick={handleAddClick}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                {isRecipePage ? 'Add Recipe' : 'Add Review'}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-4">
                            {loading ? (
                                <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                            ) : user ? (
                                <div className="flex items-center space-x-3">
                                    <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                                        {user.name}
                                    </Link>
                                    <img 
                                        src={user.profilePicture || "/default-avatar.png"} 
                                        alt="User avatar" 
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <button 
                                        onClick={handleLogout}
                                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
                                    <Link to="/signup" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-300">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Dropdown Menu */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                                    <div className="md:hidden">
                                        <Link to="/recipes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Recipes
                                        </Link>
                                        <Link to="/reviews" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Reviews
                                        </Link>
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={handleAddClick}>
                                            Add Recipe
                                        </button>
                                    </div>
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Settings
                                    </Link>
                                    <div className="border-t border-gray-100"></div>
                                    {user && (
                                        <button 
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Logout
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}