import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import Details from "./pages/Details";
import CreatePost from "./pages/CreatePostPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
        {/* All page routes are here */}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/createPost" element={<CreatePost />} />
            </Routes>
        </BrowserRouter>
    )
}