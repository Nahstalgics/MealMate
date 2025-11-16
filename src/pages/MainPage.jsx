import { useState, useEffect } from "react";
import Post from "../components/DefaultPost.jsx";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const posts = [{"restaurant": "popeyes", "comments": "shoo shoo", 
                    "restaurant": "KFC", "comments": "yum"}]

    const navigate = useNavigate();

    function handleCreatePost() {
        navigate("/createPost");
    }
    return (
        <div>
            <h1>I'm Main Page!</h1>
            {/* list of posts */}
            <button onClick={handleCreatePost}>Host a MealMate!</button>
            {posts.map((item, index) => (
                <Post key={index} data={item} />
            ))}
        </div>
    )
}

export default MainPage;