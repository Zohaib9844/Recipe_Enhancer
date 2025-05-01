import axios from "axios";
import Footer from "../Components/HeadFoot/Footer";
import Navbar from "../Components/HeadFoot/Navbar";
import RecipeList from "../Components/RecipeeList";
import { useEffect, useState } from "react";



export default function HomeView(){
    const [recipes, setrecipes] = useState([]);
    const [user, setUser] = useState([]);
    const BACKEND_URL = 'http://127.0.0.1:3000';
    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipesRes = await axios.get(
                    `${BACKEND_URL}/api/get_recipies`,
                    { withCredentials: true }
                );
                setrecipes(recipesRes.data);
            } catch(err) {
                console.error("Error:", err);
                setrecipes([]);
            }
        };
        fetchData();
    }, []);

    const handleDelete = (id)=>{
        axios.delete(BACKEND_URL+`/api/delete_recipies/${id}`).then(response=>{console.log(response)}).catch(err=>{console.error(err)});
        setrecipes(recipes.filter(recipe=>recipe._id !==id));
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar isRecipePage={true}/>
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Recipes</h1>
                <RecipeList Recipies={recipes} onDelete={handleDelete}/>
            </main>
            <Footer/>
        </div>
    );
}