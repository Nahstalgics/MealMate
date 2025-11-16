import Post from "../components/DefaultPost.jsx";
import { useNavigate } from "react-router-dom";

function MainPage() {
    const posts = [{"restaurant": "Popeyes", "eat_time": "03:48:33", "max_party": 3, 
                    "host_name": "sam", "number_accepted": 1, "comments": "shoo shoo", "username": "shahaha"}, 
                    {"restaurant": "KFC", "eat_time": "12:50:33", "max_party": 10, 
                    "host_name": "Billy", "number_accepted": 3, "comments": "Billy the Billy Song", "username": "bibaboo"}]

    const navigate = useNavigate();

    function handleCreatePost() {
        navigate("/createPost");
    }
    return (
        <div>
            <h1>I'm Main Page!</h1>
            {/* list of posts */}
            <button onClick={handleCreatePost}>Host a MealMate!</button>
            {posts.map((p) => (
                <Post 
                    key={p.restaurant} 
                    restaurant={p.restaurant}
                    eat_time={p.eat_time.slice(0,5)}
                    max_party={p.max_party}
                    number_accepted={p.number_accepted}
                    host_name={p.host_name}
                    comments={p.comments} />
            ))}
        </div>
    )
}

export default MainPage;