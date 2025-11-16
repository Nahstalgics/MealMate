import { useState, useEffect } from "react";
import Post from "../components/Post";

function MainPage() {
    const [posts, setPosts] = useState([]);

    // useEffect(() => {
    //     fetchPosts().then(data => setPosts(data));
    // }, []);

    // function addToPosts(newPost) {
    //     setPosts(prevPosts => [...prevPosts, newPost]);
    // }

    return (
        <div>
            <h1>I'm Main Page!</h1>
            {/* list of posts */}
        </div>
    )
}

export default MainPage;