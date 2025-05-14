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
  useEffect(() => {
    axios.get('api/auth/me', { withCredentials: true })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.log(err);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView/>}/>
        <Route path="/signup" element={<SignupView/>}/>
        <Route path='/addrecipe' element={<AddRecipe/>}/>
        <Route path='/showrecipe/:id' element={<RecipeDetailView/>}/>
        <Route path='/reviews/:id' element={<ReviewView/>}/>
        <Route path="/" element={<HomeView/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App
