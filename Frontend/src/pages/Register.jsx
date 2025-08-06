import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
    const [messageOpacity, setMessageOpacity] = useState("opacity-0");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        try {
            await register(email, password);
            setMessage("Registration successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to register. Please try again.");
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error || "Google sign-up failed.");
        }
    };

    useEffect(() => {
        const fadeInTimer = setTimeout(() => {
            setMessageOpacity("opacity-100");
        }, 100);
        const fadeOutTimer = setTimeout(() => {
            setMessageOpacity("opacity-0");
        }, 3000);
        const removeTimer = setTimeout(() => {
            setShowWelcomeMessage(false);
        }, 3500);
        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    return (
        // --- CHANGED HERE: Added responsive horizontal padding ---
        <div className="flex items-center justify-center flex-col min-h-screen bg-[#212121] text-gray-200 px-4 sm:px-6 lg:px-8">
            {showWelcomeMessage && (
                <h2
                    className={`text-xl p-4 absolute top-0 md:text-2xl font-bold text-center text-zinc-400 transition-opacity duration-500 ease-in-out ${messageOpacity}`}
                >
                    First time here? Please create an account.
                </h2>
            )}
            {/* --- CHANGED HERE: Added responsive padding --- */}
            <div className="relative mt-8 w-full max-w-md p-6 sm:p-8 space-y-6 bg-[#171717] rounded-xl shadow-lg">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-1 left-3  text-gray-400 hover:text-white transition"
                >
                    <i className="fa-solid fa-arrow-left"></i> Back
                </button>

                <h2 className="text-3xl font-bold text-center text-white">
                    Create Your Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-semibold">Email Address</label>
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-3 mt-2 bg-[#212121] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold">Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="6+ characters"
                            required
                            className="w-full px-4 py-3 mt-2 bg-[#212121] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        />
                    </div>
                    {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                    {message && (
                        <p className="text-green-400 text-center text-sm">{message}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 font-semibold text-white bg-zinc-600 rounded-lg hover:text-black hover:bg-zinc-300 transition"
                    >
                        Create Account
                    </button>
                </form>

                <div className="flex items-center justify-center space-x-2">
                    <span className="h-px w-full bg-gray-600"></span>
                    <span className="text-gray-400 text-sm">OR</span>
                    <span className="h-px w-full bg-gray-600"></span>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            setError("Google sign-up failed. Please try again.");
                        }}
                        theme="filled_black"
                        text="signup_with"
                        shape="pill"
                    />
                </div>

                <p className="text-sm text-center text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-500 hover:underline"
                    >
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;