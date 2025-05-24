import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/HeadFoot/Navbar';
import Footer from '../Components/HeadFoot/Footer';

export default function ProfileView({ user, loading }) {
  const navigate = useNavigate();
  const [userRecipes, setUserRecipes] = useState([]);
  const BACKEND_URL = 'http://127.0.0.1:3000';

  useEffect(() => {
    if (user) {
      const fetchUserRecipes = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/get_user_recipes/${user._id}`, {
            withCredentials: true,
          });
          setUserRecipes(response.data);
        } catch (error) {
          console.error('Error fetching user recipes:', error);
        }
      };
      fetchUserRecipes();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isRecipePage={false} user={user} loading={loading} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              <img
                src={user.profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600 mt-2">{user.email}</p>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/addrecipe')}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Recipe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Recipes</h2>
            {userRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userRecipes.map((recipe) => (
                  <div key={recipe._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={recipe.r_picture ? `${BACKEND_URL}/${recipe.r_picture}` : 'https://placehold.co/400x300'}
                      alt={recipe.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
                      <p className="text-gray-600 mt-2 line-clamp-2">{recipe.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-gray-500 mt-2">No recipes yet. Add your first recipe!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 