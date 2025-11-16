import { useState, useEffect } from "react";
import Post from "../components/Post";
import { fetchPostsq } from "../api/posts.js";

function MainPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts().then(data => setPosts(data));
    }, []);

    function addToPosts(newPost) {
        setPosts(prevPosts => [...prevPosts, newPost]);
    }

    return (
        <div>
            <h1>Find a MealMate!</h1>
            {/* list of posts */}
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    )
}

export default MainPage;