import Post from "../components/DefaultPost.jsx";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./MainPage.css";

function MainPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Get the currently logged-in user
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch("http://localhost:8000/postings");
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.detail || "Failed to fetch posts");
                }

                const data = await response.json();
                setPosts(data.data); // data.data includes listOfUsers
            } catch (err) {
                console.error("Error fetching posts:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    function handleCreatePost() {
        navigate("/createPost");
    }

    if (!loggedInUser) return <p>Please log in first!</p>;
    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="main-page">
            <div className="main-header">
                <h1>I'm Main Page!</h1>
            </div>
            <button className="create-post-button" onClick={handleCreatePost}>
                Host a MealMate!
            </button>
            <div className="posts-container">
                {posts.map((p) => (
                    <Post 
                    key={`${p.username}-${p.eat_time}`} 
                    restaurant={p.restaurant}
                    eat_time={p.eat_time}
                    max_party={p.max_party}
                    number_accepted={p.number_accepted}
                    host_name={p.host_name}
                    comments={p.comments} 
                    host_username={p.username}       // host of the post
                    currentUser={loggedInUser.username} // user viewing/joining
                    listOfUsers={p.listOfUsers || []}  // pass list of joined users
                />
                ))}
            </div>
        </div>
    );
}

export default MainPage;
