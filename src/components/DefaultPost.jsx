import { useState } from "react";
import "./Post.css"

function DefaultPost(obj) {
    const [toggled, setToggled] =useState(false);

    return (
        <div className="post-bar">
            <div className="post-header">
                <h3>{obj.restaurant}</h3>
                <button onClick={() => setToggled(!toggled)}>
                    {toggled ? `${obj.restaurant}` : obj.comments}
                </button>
            </div>

            {toggled && (
                <div className="post-details">
                    {obj.comments}
                </div>
            )}
        </div>
    )
}

export default DefaultPost