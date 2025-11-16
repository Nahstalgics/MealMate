
import Post from "../components/DefaultPost.jsx";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import "./MainPage.css"

function MainPage() {
    const [posts, setPosts] = useState([]);
    const [joinedPosts, setJoinedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        async function fetchData() {
            try {
                // ---- Fetch all postings ----
                const postRes = await fetch("http://localhost:8000/postings");
                const postData = await postRes.json();
                setPosts(postData.data);

                // ---- Fetch postings user joined ----
                const joinedRes = await fetch(
                    `http://localhost:8000/postings/joined?username=${loggedInUser.username}`
                );
                const joinedData = await joinedRes.json();

                setJoinedPosts(joinedData.all); // includes active + full
            } catch (err) {
                setError(err.message || "Error");
            } finally {
                setLoading(false);
            }
        }

        fetchData();

          // 🔥 Auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 2000);

    // cleanup on unmount
    return () => clearInterval(interval);
    }, []);
    function handleCreatePost() {
        navigate("/createPost");
    }

    return (
        <div>
            <h1>Let's find a MealMate!</h1>

            <button onClick={handleCreatePost}>Host a MealMate!</button>

            {/* ------------------------------ */}
            {/*       YOUR JOINED POSTS        */}
            {/* ------------------------------ */}
            <h2>Your MealMates</h2>

            {joinedPosts.length === 0 && <p>You haven't joined any meals yet.</p>}

            {joinedPosts.map((p) => (
                <Post
                    key={`joined-${p.username}-${p.eat_time}`}
                    restaurant={p.restaurant}
                    eat_time={p.eat_time}
                    max_party={p.max_party}
                    number_accepted={p.number_accepted}
                    host_name={p.host_name}
                    comments={p.comments}
                    host_username={p.username}
                    currentUser={loggedInUser.username}
                    listOfUsers={p.listOfUsers || []}
                />
            ))}

            <hr />

            {/* ------------------------------ */}
            {/*     ALL PUBLIC POSTINGS        */}
            {/* ------------------------------ */}
            <h2>All MealMates</h2>

            {posts.map((p) => (
                <Post 
                    key={`${p.username}-${p.eat_time}`} 
                    restaurant={p.restaurant}
                    eat_time={p.eat_time}
                    max_party={p.max_party}
                    number_accepted={p.number_accepted}
                    host_name={p.host_name}
                    comments={p.comments}
                    host_username={p.username}
                    currentUser={loggedInUser.username}
                    listOfUsers={p.listOfUsers || []}
                />
            ))}
        </div>
    );
}

export default MainPage;
 