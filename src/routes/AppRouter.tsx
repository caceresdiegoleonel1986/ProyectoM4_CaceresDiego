import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import TasksPage from "../pages/Tasks";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => (
    <BrowserRouter>
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/tasks"
                        element={
                            <ProtectedRoute>
                                <TasksPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
        </div>
    </BrowserRouter>
);