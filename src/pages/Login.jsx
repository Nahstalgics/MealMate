import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";

function Login() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [showUsernameInput, setShowUsernameInput] = useState(false);

    function handleLogin(e) {
        e.preventDefault();

        if (isLogin) {
            console.log('Logging in:', { username, password });
            // TODO: API call to /api/login
        } else {
            console.log('Signing up:', { firstName, lastName, username, email, password });
            // TODO: API call to /api/signup
        }

        navigate("/mainPage");
    }

    function handleUsernameSubmit(e) {
        e.preventDefault();
        console.log('Completing Google signup with username:', username);

        // TODO: Send username to backend
        navigate("/mainPage");
    }

    // If Google signup and waiting for username
    if (showUsernameInput) {
        return (
            <div className="main">
                <div className="phrasing">
                    <h1 className="title">MealMate</h1>
                    <h3 className="logo">Don't have anyone to eat with? Find a friend!</h3>
                </div>
                <div className="login-container">
                    <div className="login-box">
                        <h1 className="login-signup-header">Choose a Username</h1>
                        <p>Complete your Google sign up</p>

                        <form onSubmit={handleUsernameSubmit}>
                            <input
                                className="input"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <button type="submit">Complete Sign Up</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main">
            <div className="phrasing">
                <h1 className="title">MealMate</h1>
                <h3 className="logo">Don't have anyone to eat with? Find a friend!</h3>
            </div>
            <div className="login-container">
                <div className="login-box">
                    <h1 className="login-signup-header">{isLogin ? 'Login' : 'Sign Up'}</h1>

                    {/* REGULAR LOGIN/SIGNUP */}
                    <div className="regular-auth">
                        <form onSubmit={handleLogin}>
                            {!isLogin && (
                                <>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />

                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />

                                    <input
                                        className="input"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </>
                            )}

                            <input
                                className="input"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />

                            <input
                                className="input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button type="submit">
                                {isLogin ? 'Login' : 'Sign Up'}
                            </button>
                        </form>
                    </div>

                    {/* OR DIVIDER */}
                    <div className="divider">
                        <span>OR</span>
                    </div>

                    {/* GOOGLE LOGIN/SIGNUP */}
                    <div className="google-auth">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                console.log("Google token:", credentialResponse.credential);

                                // Send token to Flask backend
                                fetch("http://127.0.0.1:5000/auth/google", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        credential: credentialResponse.credential,
                                    }),
                                })
                                    .then((res) => res.json())
                                    .then((data) => {
                                        console.log("Backend:", data);

                                        if (data.needs_username) {
                                            setShowUsernameInput(true);
                                        } else {
                                            navigate("/mainPage");
                                        }
                                    });
                            }}
                            onError={() => {
                                console.log("Google Login Failed");
                            }}
                        />
                    </div>

                    {/* TOGGLE */}
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign Up' : 'Login'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;