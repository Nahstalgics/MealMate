import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    function handleLogin() {
        navigate("/mainPage");
    }

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login;