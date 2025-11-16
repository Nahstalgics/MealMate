import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DefaultPost.css";

// import "./data/posts.json"

function DefaultPost(obj) {
    const [toggled, setToggled]=useState(false);
    const navigate = useNavigate();

    function handleJoin() {
        navigate("/mainPage")
    }

    return (
        <div className="post-bar">
            <div className="top-bar">
                <div className="left">
                    <h3>{obj.restaurant}</h3>
                    <p>{obj.host_name}</p>
                    <p>{obj.number_accepted} / {obj.max_party}</p>
                </div>
                <div className="right">
                    <p>{obj.eat_time}</p>
                    <button onClick={() => setToggled(!toggled)}>
                        {toggled ? "hide" : "details"}
                    </button>
                </div>
            </div>
            {toggled && (
                <div className="bottom-bar">
                    <div className="details">
                        {obj.comments}
                    </div>
                    <button className="join" onClick={handleJoin}>Join</button>
                </div>
            )}
        </div>
    )
}

export default DefaultPost