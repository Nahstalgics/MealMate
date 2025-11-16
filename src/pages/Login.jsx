import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

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
        
        // Navigate to main page after login/signup
        navigate("/mainPage");
    }

    function handleGoogleAuth() {
        if (isLogin) {
            console.log('Google Login clicked');
            // TODO: Google OAuth login
            navigate("/mainPage");
        } else {
            console.log('Google Signup clicked');
            // TODO: Google OAuth signup
            // Show username input after Google auth
            setShowUsernameInput(true);
        }
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
                                        class = "input"
                                        type="text"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                    
                                    <input
                                        class = "input"
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                    
                                    <input
                                        class = "input"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </>
                            )}
                            
                            <input
                                class = "input"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            
                            <input
                                class = "input"
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
                        <button 
                            className="google-button"
                            onClick={handleGoogleAuth}
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" />
                            {isLogin ? 'Login with Google' : 'Sign Up with Google'}
                        </button>
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