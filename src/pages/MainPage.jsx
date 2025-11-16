import { useState, useEffect } from "react";
import Post from "../components/DefaultPost.jsx";
import { fetchPostsq } from "../api/posts.js";

function MainPage() {
    return (
        <div>
            <h1>I'm Main Page!</h1>
            {/* list of posts */}
        </div>
    )
}

export default MainPage;