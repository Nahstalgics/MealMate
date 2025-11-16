import "./App.css"
import { useState } from "react";
import Post from "./components/Post"

import Login from "./pages/Login"
import Main from "./pages/Main"
import Details from "./pages/Details"

function App() {
    return (
        <div className="app">
            Welcome to MealMate!
            <BrowserRouter>
                {/* 
                    Global layout pieces go here 
                    i.e. NavBar, sidebar, theme provider etc.
                */}

                {/* All page routes are here */}
                <Routes>
                    {/* route for  */}
                </Routes>
            </BrowserRouter>

        </div>
    )
}