import Footer from "../Components/HeadFoot/Footer";
import Navbar from "../Components/HeadFoot/Navbar";
import ReviewList from "../Components/ReviewList";
import { useEffect, useState } from "react";
import ReviewPopup from "../Components/ReviewPopup";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoginPromptPopup from "../Components/LoginPromptPopup";

export default function ReviewView({ user, loading }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const {id} = useParams();
    const [reviews, setreviews] = useState([]);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    console.log(id);
    useEffect(()=>{
        axios.get(`http://127.0.0.1:3000/review/get_reviews/${id}`).then(response=>{
            setreviews(response.data);
        }).catch(err=>{console.log(err)})
    }, []);
    
    const handleSubmit = async (reviewData) => {
        console.log("Submitting review:", reviewData); // Debugging: Check reviewData
        await axios.post('http://127.0.0.1:3000/review/add_review/', reviewData)
            .then(response => {
                console.log("Review submitted successfully:", response); // Debugging: Check review response
                // Refresh reviews after adding a new one
                axios.get(`http://127.0.0.1:3000/review/get_reviews/${id}`)
                    .then(response => {
                        setreviews(response.data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.error("Error submitting review:", err); // Debugging: Check API error
            });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar 
                isRecipePage={false} 
                onAddClick={() => {
                    if (!user) {
                        setShowLoginPrompt(true);
                    } else {
                        setIsPopupOpen(true);
                    }
                }}
                user={user}
                loading={loading}
            />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Recipe Reviews</h1>
                <ReviewList reviews={reviews}/>
            </main>
            <Footer/>

            <LoginPromptPopup 
                isOpen={showLoginPrompt} 
                onClose={() => setShowLoginPrompt(false)} 
            />
            <ReviewPopup 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                recipeId={id}
                onSubmit={handleSubmit}
            />
        </div>
    );
}