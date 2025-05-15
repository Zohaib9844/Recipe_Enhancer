import { useState, useEffect } from 'react'
import './App.css'
import SignupView from './Views/SignupView';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from './Views/LoginView';
import HomeView from './Views/HomeView';
import AddRecipe from './Views/AddRecipeView';
import RecipeDetailView from './Views/RecipeDetailView';
import ReviewView from './Views/ReviewsView';
import axios from 'axios';  

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/me', {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.log("Not authenticated");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView/>}/>
        <Route path="/signup" element={<SignupView/>}/>
        <Route path='/addrecipe' element={<AddRecipe/>}/>
        <Route path='/showrecipe/:id' element={<RecipeDetailView/>}/>
        <Route path='/reviews/:id' element={<ReviewView/>}/>
        <Route path="/" element={<HomeView user={user} loading={loading}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
