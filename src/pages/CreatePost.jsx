import { useState } from "react";

function CreatePost() {
    const [newPost, setNewPost] = useState({
        restuarant: "",
        host: "",
        time: "",
        maxParty: null
    })

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="What restaurant is this?"
                value={newPost.restuarant}
                onChange={(e) => setNewPost({ ...newPost, restuarant: e.target.value})}
            />
        </form>
    )
}

export default CreatePost