import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Google login failed.');
        }
    };
    
    return (
        // --- CHANGED HERE: Added responsive horizontal padding ---
        <div className="flex items-center justify-center min-h-screen bg-[#212121] text-gray-200 px-4 sm:px-6 lg:px-8">
            {/* --- CHANGED HERE: Added responsive padding --- */}
            <div className="relative w-full max-w-md p-6 sm:p-8 space-y-6 bg-[#171717] rounded-xl shadow-lg">
                <button onClick={() => navigate(-1)} className="absolute top-1 left-3 text-gray-400 hover:text-white transition">
                    <i className="fa-solid fa-arrow-left"></i> Back
                </button>
                
                <h2 className="text-3xl font-bold text-center text-white">Welcome Back!</h2>
                
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 mt-2 bg-[#212121] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600"
                        />
                    </div>
                    {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                    <button type="submit" className="w-full py-3 font-semibold text-white bg-zinc-600 rounded-lg hover:text-black hover:bg-zinc-300 transition">
                        Log In
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
                            setError('Google login failed. Please try again.');
                        }}
                        theme="filled_black"
                        text="signin_with"
                        shape="pill"
                    />
                </div>

                <p className="text-sm text-center text-gray-400">
                    Don't have an account? <Link to="/register" className="font-semibold text-blue-500 hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;