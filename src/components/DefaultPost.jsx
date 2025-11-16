import "./Post.css"

function Post(props) {
    const newPost = {
        restaurant: "myres",
        eat_time: "09:20:32",
        max_people: 6,
        host_name: "sam",
        number_accepted: 0,
        comments: "Go away",
        username: "wallee"
    }

    const handleCreatePost = () => {
        fetch("http://localhost:8000/hostings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newHosting),
          })
            .then((res) => res.json())
            .then((data) => console.log("Hosting created:", data))
            .catch((err) => console.error(err));
    }

    return (
        // <div className="single-post">
        //     <h2>{props.restaurant}</h2>
        //     <h3>{props.eat_time}</h3>
        //     <h3>{props.max_party}</h3>
        //     <h3>{props.host}</h3>
        // </div>
        <div>
            <button onClick={handleCreatePost}>Create Hoosting</button>
        </div>
    )
}

export default Post