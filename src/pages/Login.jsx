import { useNavigate } from "react-router-dom";

import React, { useState } from 'react';

function Login() {
    const navigate = useNavigate();

    function handleLogin() {
        navigate("/mainPage");
    }

    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isLogin) {
            console.log('Logging in:', { username, password });
            // TODO: API call to /api/login
        } else {
            console.log('Signing up:', { firstName, lastName, username, password });
            // TODO: API call to /api/signup
        }
    };

    return (
        <div className = "main">
            <div className = "phrasing">
                <h1 className = "title">MealMate</h1>
                <h3 className = "logo">logo logo logo</h3>
            </div>
            <div className="login-container">
                <div className="login-box">
                    <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                    
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </>
                        )}
                        
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        
                        <button onClick={handleLogin} type="submit">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                    
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Sign Up' : 'Login'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;