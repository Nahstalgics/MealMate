import "./Post.css"

function Post(props) {
    return (
        <div className="single-post">
            <h2>{props.restaurant}</h2>
            <h3>{props.time}</h3>
            <h3>{props.maxParty}</h3>
            <h3>{props.host}</h3>
        </div>
    )
}

export default Post