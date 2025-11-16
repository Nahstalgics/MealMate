import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [showUsernameInput, setShowUsernameInput] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();

        if (isLogin) {
            // LOGIN
            try {
                const response = await fetch("http://localhost:8000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.detail || "Login failed");
                }

                const data = await response.json();
                console.log("Login successful:", data);

                localStorage.setItem("user", JSON.stringify(data.user));

                navigate("/mainPage");
            } catch (err) {
                console.error("Login failed:", err.message);
                alert("Login failed: " + err.message);
            }
        } else {
            // SIGNUP
            try {
                const response = await fetch("http://localhost:8000/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ firstName, lastName, username, email, password }),
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.detail || "Signup failed");
                }

                const data = await response.json();
                console.log("Signup successful:", data);

                // Auto-login
                const loginResponse = await fetch("http://localhost:8000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                if (!loginResponse.ok) {
                    const errData = await loginResponse.json().catch(() => ({}));
                    throw new Error(errData.detail || "Auto-login failed");
                }

                const loginData = await loginResponse.json();
                console.log("Auto-login successful:", loginData);

                localStorage.setItem("user", JSON.stringify(loginData.user));

                navigate("/mainPage");
            } catch (err) {
                console.error("Signup failed:", err.message);
                alert("Signup failed: " + err.message);
            }
        }
    }

    function handleUsernameSubmit(e) {
        e.preventDefault();
        console.log("Completing Google signup with username:", username);

        navigate("/mainPage");
    }

    // If Google signup needs username
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
                    <h1 className="login-signup-header">{isLogin ? "Login" : "Sign Up"}</h1>

                    <div className="auth-wrapper">
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

                                <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
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
                    </div>

                    {/* TOGGLE */}
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Sign Up" : "Login"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
