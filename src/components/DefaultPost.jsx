import { useState, useEffect } from "react";
import "./DefaultPost.css"

function DefaultPost({ restaurant, eat_time, max_party, host_name, comments, host_username, listOfUsers }) {
    const [toggled, setToggled] = useState(false);
    const [usersList, setUsersList] = useState(listOfUsers || []);

    // Keep local state in sync if prop changes
    useEffect(() => {
        setUsersList(listOfUsers || []);
    }, [listOfUsers]);

    // Get the currently logged-in user
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

    const currentAccepted = usersList.length;

    async function handleJoin() {
        if (!loggedInUser.username) {
            alert("You must be logged in to join a post.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/postings/join?restaurant=${encodeURIComponent(restaurant)}&eat_time=${encodeURIComponent(eat_time)}&host_username=${encodeURIComponent(host_username)}&joining_username=${encodeURIComponent(loggedInUser.username)}`,
                { method: "PATCH", headers: { "Content-Type": "application/json" } }
            );

            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || JSON.stringify(data));

            if (data.status === "success" || data.status === "moved") {
                setUsersList(prev => [...prev, loggedInUser.username]);
            }

        } catch (err) {
            console.error("Failed to join post:", err);
            alert("Failed to join: " + (err.message || JSON.stringify(err)));
        }
    }

    async function handleLeave() {
        if (!loggedInUser.username) {
            alert("You must be logged in to leave a post.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/postings/leave?username=${encodeURIComponent(loggedInUser.username)}&host_username=${encodeURIComponent(host_username)}&eat_time=${encodeURIComponent(eat_time)}`,
                { method: "PATCH" }
            );

            const data = await response.json();

            if (!response.ok) throw new Error(data.detail || JSON.stringify(data));

            setUsersList(prev => prev.filter(u => u !== loggedInUser.username));

        } catch (err) {
            console.error("Failed to leave post:", err);
            alert("Failed to leave: " + (err.message || JSON.stringify(err)));
        }
    }

    const isJoined = usersList.includes(loggedInUser.username);
    const isHost = host_username === loggedInUser.username;

    return (
        <div className="post-bar">
            <div className="top-bar">
                <div className="left">
                    <h3>{restaurant}</h3>
                    <p>Host: {host_name}</p>
                    <p>{currentAccepted} / {max_party}</p>
                </div>
                <div className="right">
                    <p>{eat_time.slice(0,5)}</p>
                    <button onClick={() => setToggled(!toggled)}>
                        {toggled ? "hide" : "details"}
                    </button>
                </div>
            </div>

            {toggled && (
                <div className="bottom-bar">
                    <div className="details">
                        <p>{comments}</p>
                        <p>Attendees: {usersList.join(", ")}</p>
                        <button
                            onClick={handleJoin}
                            disabled={isJoined || currentAccepted >= max_party || isHost}
                        >
                            {isJoined ? "Joined" : "Join"}
                        </button>
                        {!isHost && isJoined && (
                            <button onClick={handleLeave} style={{ marginLeft: "10px" }}>
                                Leave
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DefaultPost;
