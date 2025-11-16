import { useState } from "react";

function CreatePost() {
    const restaurantList = ["Cherr", "a", "b", "c"]

    const [restaurant, setRestaurant] = useState(restaurantList[0]);
    const [eat_time, setTime] = useState("");
    const [max_party, setMaxParty] = useState(1);
    const [comments, setComments] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            eat_time,
            max_party,
            comments
        }

        fetch("http://localhost:8000/hostings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newHosting),
          })
            .then((res) => res.json())
            .then((data) => console.log("Hosting created:", data))
            .catch((err) => console.error(err))
    }

    const handleTime = (e) => {
        const completeTime = `${e.target.value}:00`;
        setTime(completeTime);
    }

    return (
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
            {/* <div>
                {restaurantList.map((rest) => (
                    <label key={rest} style={{ marginRight: "10px" }}>
                        <input
                            type="radio"
                            value={rest}
                            checked={restaurant === rest}
                            onChange={() => setRestaurant(rest)}
                            required
                        />
                        {rest}
                    </label>
                ))}
            </div> */}
            <input
                type="time"
                value={time.slice(0, 5)}
                onChange={handleTime}
                placeholder="What time will we meet?"
                required
            />
            <input
                type="number"
                value={max_party}
                min={2}
                onChange={(e) => setMaxParty(parseInt(e.target.value) || 1)}
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
    )
}

export default CreatePost