import "./App.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "./components/DefaultPost"

import Login from "./pages/Login"
import MainPage from "./pages/MainPage"
import Details from "./pages/Details"
import AppRouter from "./Router";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    // const navigate = useNavigate();


    // return (
    //     <div className="app">
    //         <h1>Welcome to MealMate!</h1>
    //     </div>
    // )
    return <AppRouter />;
}

export default App;