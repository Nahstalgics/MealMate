import { useState, useEffect } from "react";
import Post from "../components/DefaultPost.jsx";
import { fetchPostsq } from "../api/posts.js";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const navigate = useNavigate();

    function handleCreatePost() {
        navigate("/createPost");
    }
    return (
        <div>
            <h1>I'm Main Page!</h1>
            {/* list of posts */}
            <button onClick={handleCreatePost}>Host a MealMate!</button>
        </div>
    )
}

export default MainPage;