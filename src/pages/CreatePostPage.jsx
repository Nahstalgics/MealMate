import { useState } from "react";
import restaurantData from "../components/data/business-licences.json";

function CreatePost() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const restaurantList = restaurantData
        .map((item) => `${item.businesstradename} ${item.street}`)
        .filter(Boolean);

    const [restaurant, setRestaurant] = useState(restaurantList[0] || "");
    const [eat_time, setTime] = useState("");
    const [max_party, setMaxParty] = useState(null);
    const [comments, setComments] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!user.username) {
            alert("You must be logged in to create a post.");
            return;
        }
    
        const newPost = {
            restaurant,
            eat_time,
            max_party,
            comments,
            username: user.username,
            host_name: user.firstName,
            number_accepted: 1,
            listOfUsers: [user.username],
        };
    
        try {
            const res = await fetch("http://localhost:8000/postings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost),
            });
    
            if (!res.ok) {
                let errData;
                try {
                    errData = await res.json();
                } catch {
                    errData = { detail: await res.text() };
                }
                throw new Error(JSON.stringify(errData, null, 2));
            }
    
            const data = await res.json();
            console.log("Post created:", data);
            alert("Post created successfully!");
    
        } catch (err) {
            console.error("Error creating post:", err);
            alert("Error creating post: " + (err.message || JSON.stringify(err)));
        }
    };

    const handleTime = (e) => {
        const completeTime = `${e.target.value}:00`;
        setTime(completeTime);
    };

    return (
        <div>
            <h1>Host a MealMate</h1>
            <form onSubmit={handleSubmit}>
                <select
                    value={restaurant}
                    onChange={(e) => setRestaurant(e.target.value)}
                    required
                >
                    <option value="">Select a Restaurant</option>
                    {restaurantList.map((rest) => (
                        <option key={rest} value={rest}>
                            {rest}
                        </option>
                    ))}
                </select>

                <input
                    type="time"
                    value={eat_time.slice(0, 5)}
                    onChange={handleTime}
                    placeholder="What time will we meet?"
                    required
                />

                <input
                    type="number"
                    value={max_party || ""}
                    min={2}
                    onChange={(e) => setMaxParty(parseInt(e.target.value) || 2)}
                    placeholder="Max Party"
                    required
                />

                <input
                    type="text"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Comments"
                    required
                />

                <button type="submit">Submit Post</button>
            </form>
        </div>
    );
}

export default CreatePost;
