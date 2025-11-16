// import Post from "../components/DefaultPost.jsx";
// import { useNavigate } from "react-router-dom";
// import React, { useState, useEffect } from "react";

// import "./MainPage.css"

// function MainPage() {
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const navigate = useNavigate();

//     // Get the currently logged-in user
//     const loggedInUser = JSON.parse(localStorage.getItem("user"));

//     useEffect(() => {
//         async function fetchPosts() {
//             try {
//                 const response = await fetch("http://localhost:8000/postings");
//                 if (!response.ok) {
//                     const errData = await response.json().catch(() => ({}));
//                     throw new Error(errData.detail || "Failed to fetch posts");
//                 }

//                 const data = await response.json();
//                 setPosts(data.data); // data.data includes listOfUsers
//             } catch (err) {
//                 console.error("Error fetching posts:", err.message);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         fetchPosts();
//     }, []);

//     function handleCreatePost() {
//         navigate("/createPost");
//     }

//     if (!loggedInUser) return <p>Please log in first!</p>;
//     if (loading) return <p>Loading posts...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <div>
//             <h1>I'm Main Page!</h1>
//             <button onClick={handleCreatePost}>Host a MealMate!</button>
//             {posts.map((p) => (
//                 <Post 
//                     key={`${p.username}-${p.eat_time}`} 
//                     restaurant={p.restaurant}
//                     eat_time={p.eat_time}
//                     max_party={p.max_party}
//                     number_accepted={p.number_accepted}
//                     host_name={p.host_name}
//                     comments={p.comments} 
//                     host_username={p.username}       // host of the post
//                     currentUser={loggedInUser.username} // user viewing/joining
//                     listOfUsers={p.listOfUsers || []}  // pass list of joined users
//                 />
//             ))}
//         </div>
//     );
// }

// export default MainPage;

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
            <h1>I'm Main Page!</h1>

            <button onClick={handleCreatePost}>Host a MealMate!</button>

            {/* ------------------------------ */}
            {/*       YOUR JOINED POSTS        */}
            {/* ------------------------------ */}
            <h2>Your Joined Meals</h2>

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
 