import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Post.css";

// import "./data/posts.json"

function DefaultPost(obj) {
    const [toggled, setToggled]=useState(false);
    const navigate = useNavigate();

    function handleJoin() {
        navigate("/mainPage")
    }

    return (
        <div className="post-bar">
            <div className="post-header">
                <h3>{obj.restaurant}</h3>
                <p>{obj.eat_time}</p>
                <p>{obj.number_accepted} / {obj.max_party}</p>
                <p>{obj.host_name}</p>
                <button onClick={() => setToggled(!toggled)}>
                    {toggled ? "hide" : "details"}
                </button>
            </div>

            {toggled && (
                <div className="post-details">
                    {obj.comments}
                    <button onClick={handleJoin}>Join</button>
                </div>
            )}
        </div>
    )
}

export default DefaultPost