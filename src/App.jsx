import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard/Dashboard";
import { LoginPage } from "./components/LoginPage";
import { ToastContainer } from "react-toastify";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsAuthenticated(isLoggedIn);
    }, []);

    return (
        <div className="bg-black">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <BrowserRouter basename="/aidashboard">
                <Routes>
                    <Route
                        path="/ai-login"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/ai-dashboard" />
                            ) : (
                                <LoginPage setIsAuthenticated={setIsAuthenticated} />
                            )
                        }
                    />
                    <Route
                        path="/ai-dashboard"
                        element={
                            isAuthenticated ? <Dashboard /> : <Navigate to="/ai-login" />
                        }
                    />
                    <Route path="*" element={<Navigate to="/ai-login" />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;