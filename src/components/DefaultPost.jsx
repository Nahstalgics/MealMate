import { useState } from "react";

function DefaultPost({ restaurant, eat_time, max_party, number_accepted, host_name, comments, host_username, listOfUsers }) {
    const [toggled, setToggled] = useState(false);
    const [currentAccepted, setCurrentAccepted] = useState(number_accepted);
    const [usersList, setUsersList] = useState(listOfUsers || []);

    // Get the currently logged-in user
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

    async function handleJoin() {
        if (!loggedInUser.username) {
            alert("You must be logged in to join a post.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/postings/join?restaurant=${encodeURIComponent(restaurant)}&eat_time=${encodeURIComponent(eat_time)}&host_username=${encodeURIComponent(host_username)}&joining_username=${encodeURIComponent(loggedInUser.username)}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || JSON.stringify(data) || "Failed to join post");
            }

            console.log("Join successful:", data);

            if (data.status === "success" || data.status === "moved") {
                setCurrentAccepted(prev => prev + 1);
                setUsersList(prev => [...prev, loggedInUser.username]);
            }

        } catch (err) {
            console.error("Failed to join post:", err);
            alert("Failed to join: " + (err.message || JSON.stringify(err)));
        }
    }

    return (
        <div className="post-bar">
            <div className="post-header">
                <h3>{restaurant}</h3>
                <p>{eat_time.slice(0,5)}</p>
                <p>{currentAccepted} / {max_party}</p>
                <p>Host: {host_name}</p>
                <button onClick={() => setToggled(!toggled)}>
                    {toggled ? "hide" : "details"}
                </button>
            </div>
            {toggled && (
                <div className="post-details">
                    <p>{comments}</p>
                    <p>Attendees: {usersList.join(", ")}</p>
                    <button onClick={handleJoin} disabled={usersList.includes(loggedInUser.username) || currentAccepted >= max_party}>
                        {usersList.includes(loggedInUser.username) ? "Joined" : "Join"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default DefaultPost;
