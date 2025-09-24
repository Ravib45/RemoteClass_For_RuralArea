// src/pages/Landing.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Typewriter } from "react-simple-typewriter";
import animationData from "../assets/animations/OnlineLearning.json";

import logoAnimation from "../assets/animations/logo.json";
import "../styles/landingBubbles.css";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import uploadAnimation from "../assets/animations/uploads.json";
import chartsAnimation from "../assets/animations/charts.json";
import exportAnimation from "../assets/animations/exports.json";
import PlatformHighlights from "../components/PlatformHighlights";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiHelpCircle, FiChevronDown } from "react-icons/fi";
import FAQFeedback from "../components/FAQFeedback";
import CookieBanner from "../components/CookieBanner";

import newsletterAnimation from "../assets/animations/newsletter.json";





const Landing = () => {
    const [formType, setFormType] = useState(null);
    const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true); // true = dark by default
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);



    // 🔑 Dummy user database (for demo only!)
    const mockUsers = [
        { username: "student_anjali", email: "anjali@student.test", password: "Student@123", role: "student" },
        { username: "student_ravi", email: "ravi@student.test", password: "LearnNow!456", role: "student" },
        { username: "student_maya", email: "maya@student.test", password: "Study2025#", role: "student" },
        { username: "teacher_singh", email: "singh@teacher.test", password: "Teach@1234", role: "teacher" },
        { username: "teacher_preeti", email: "preeti@teacher.test", password: "Classroom#99", role: "teacher" },
        { username: "admin", email: "admin@ruralremote.test", password: "Admin!2025", role: "admin" }
    ];

    // ⚡ Handle login/register
    const handleAuth = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        // ✅ Find matching user
        const user = mockUsers.find(
            (u) => u.username === username && u.password === password
        );

        if (user) {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("role", user.role);
            alert(`Welcome back, ${user.username}! You are logged in as ${user.role}`);

            // 🎯 Redirect to correct dashboard
            if (user.role === "student") {
                navigate("/student-dashboard");
            } else if (user.role === "teacher") {
                navigate("/teacher-dashboard");
            } else if (user.role === "admin") {
                navigate("/admin-dashboard");
            }
        } else {
            alert("❌ Invalid username or password. Try demo accounts!");
        }
    };



    return (
        <div className={`${darkMode
            ? "bg-gradient-to-br from-[#0f0c29] via-[#47029bb0] to-[#24243e] text-white"
            : "bg-gradient-to-br from-[#ffffff] via-[#f8f9fc] to-[#e0e7ff] text-gray-900"
            } transition-colors duration-500 min-h-screen`}>
            <div className="absolute inset-0 -z-10">
                <div className="bubbles"></div>
            </div>

            {/* 🌐 Navbar */}
            <nav className="w-full fixed top-0 left-0 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-white/10 shadow-md z-50">
                <div className="flex items-center gap-2">
                    {/* 🔄 Replace with your new logo/animation */}
                    <Player autoplay loop src={logoAnimation} style={{ height: "40px", width: "40px" }} />
                    <span className="text-xl font-bold text-blue-500">Fire Folks</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 text-white">
                    <a href="#" className="hover:text-blue-400 font-medium">Home</a>
                    <button onClick={() => setFormType("login")} className="hover:text-blue-400 font-medium">Login</button>
                    <button onClick={() => setFormType("register")} className="hover:text-blue-400 font-medium">Register</button>

                    {/* Dark/Light Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="ml-4 px-3 py-1 rounded-full bg-white/20 hover:bg-blue-400 transition text-sm font-medium text-white"
                    >
                        {darkMode ? "🌙 Dark" : "☀️ Light"}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white text-2xl">☰</button>
                </div>
            </nav>

            {/* 🔅 Dim Background Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* 📱 Mobile Sidebar */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-0 right-0 w-64 h-full bg-[#101828] bg-opacity-95 backdrop-blur-xl text-white shadow-2xl z-50 p-6 flex flex-col gap-6 animate-slideIn rounded-l-3xl border-l border-blue-700/40">

                    {/* ❌ Close Button */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-4xl text-gray-400 hover:text-red-500 self-end"
                        aria-label="Close menu"
                    >
                        ×
                    </button>

                    {/* 🌐 Menu Links */}
                    <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition">
                        <i className="fas fa-home"></i> Home
                    </a>

                    <button
                        onClick={() => { setFormType("login"); setMobileMenuOpen(false); }}
                        className="flex items-center gap-2 hover:text-blue-400 transition"
                    >
                        <i className="fas fa-sign-in-alt"></i> Login
                    </button>
                    <button
                        onClick={() => { setFormType("register"); setMobileMenuOpen(false); }}
                        className="flex items-center gap-2 hover:text-blue-400 transition"
                    >
                        <i className="fas fa-user-plus"></i> Register
                    </button>

                    {/* Dark/Light Mode Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="ml-2 px-3 py-1 rounded-full bg-white/20 hover:bg-blue-400 transition text-sm font-medium text-white"
                    >
                        {darkMode ? "🌙 Dark" : "☀️ Light"}
                    </button>
                </div>
            )}

            {/* 🔥 Hero Section */}
            <section className="pt-32 px-6 pb-20 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
                {/* Left Content */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-lg">
                        Welcome to <span className="text-blue-500">Fire Folks</span>
                    </h1>
                    <p className="text-xl">
                        <Typewriter
                            words={[
                                "Remote Classroom for Rural Colleges",
                                "Learn Anytime, Anywhere",
                                "Audio-First, Offline Packets",
                            ]}
                            loop={true}
                            cursor
                            cursorStyle="|"
                            typeSpeed={60}
                            deleteSpeed={40}
                            delaySpeed={1500}
                        />
                    </p>
                    <p className="text-gray-200 max-w-lg">
                        A lightweight Progressive Web App designed for rural colleges.
                        Audio-first lessons, compressed slides, and offline access —
                        education made simple and accessible.
                    </p>
                    <div className="flex gap-4 justify-center md:justify-start">
                        <button
                            onClick={() => setFormType("login")}
                            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-xl shadow hover:bg-blue-400 transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setFormType("register")}
                            className="border border-white px-6 py-2 rounded-xl hover:bg-white hover:text-blue-800 transition"
                        >
                            Register
                        </button>
                    </div>
                </div>

                {/* Right Animation */}
                <div className="flex-1 flex justify-center items-center">
                    <Player
                        autoplay
                        loop
                        src={animationData} // 🔄 Replace with education-related animation (e.g., books, students, learning)
                        className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px]"
                    />
                </div>
            </section>



            <footer className=" text-white py-14 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

                    {/* 🔥 Branding */}
                    <div>
                        <h3 className="text-yellow-300 text-2xl font-extrabold mb-3">RuralRemoteClass</h3>
                        <p className="text-sm text-gray-400">
                            Bringing quality education to every corner 🌍📚
                        </p>
                    </div>

                    {/* 📌 Links */}
                    <div className="flex flex-col space-y-3 text-sm text-gray-300">
                        <h4 className="text-yellow-300 font-semibold mb-1">Quick Links</h4>
                        <a href="#" className="hover:text-yellow-400 transition">Home</a>
                        <a href="#features" className="hover:text-yellow-400 transition">Features</a>
                        <a href="#faq" className="hover:text-yellow-400 transition">FAQs</a>
                    </div>

                    {/* 🌍 World Reach */}
                    <div>
                        <h4 className="text-yellow-300 font-semibold mb-2">🎓 Global Learners</h4>
                        <div className="relative w-full h-36 rounded-lg overflow-hidden shadow-md border border-white/10">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1024px-World_map_-_low_resolution.svg.png"
                                alt="World Map"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-[35%] left-[70%] w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                            <div className="absolute top-[25%] left-[25%] w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                            <div className="absolute top-[10%] left-[80%] w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Trusted by <span className="text-yellow-300 font-bold">50k+ rural students</span> worldwide
                        </p>
                    </div>
                </div>

                {/* 🧩 Bottom Line */}
                <div className="text-center text-xs text-gray-500 border-t border-white/10 mt-12 pt-4">
                    &copy; {new Date().getFullYear()} RuralRemoteClass. All rights reserved.
                </div>
            </footer>



            {/* 🔐 Auth Modal */}
            {formType && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white text-gray-800 w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fadeIn relative">
                        <button
                            onClick={() => {
                                setFormType(null);
                                setForgotPasswordStep(0);
                            }}
                            className="absolute top-3 right-4 text-xl text-gray-400 hover:text-red-500"
                        >
                            ×
                        </button>

                        <h2 className="text-2xl font-bold text-center mb-6">
                            {formType === "login" && forgotPasswordStep === 0
                                ? "Login to Your Account"
                                : formType === "register"
                                    ? "Create an Account"
                                    : forgotPasswordStep === 1
                                        ? "Enter OTP"
                                        : "Reset Password"}
                        </h2>

                        {/* Forgot Password Flow */}
                        {formType === "login" && forgotPasswordStep > 0 ? (
                            <form className="space-y-4">
                                {/* ... your forgot password code stays same ... */}
                            </form>
                        ) : (
                            <form className="space-y-4" onSubmit={handleAuth}>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-yellow-400"
                                    required
                                />

                                {formType === "register" && (
                                    <>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-yellow-400"
                                            required
                                        />

                                        {/* 🎓 Attractive Role Selector */}
                                        <div>
                                            <p className="text-sm font-semibold text-gray-600 mb-2">Choose your role</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Student Card */}
                                                <label className="relative cursor-pointer">
                                                    <input type="radio" name="role" value="student" className="peer hidden" required />
                                                    <div className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:shadow-lg hover:border-yellow-400 peer-checked:border-yellow-400 peer-checked:bg-yellow-50 transition">
                                                        <span className="text-3xl">🎓</span>
                                                        <p className="mt-2 font-bold">Student</p>
                                                        <p className="text-xs text-gray-500">Learn & Grow</p>
                                                    </div>
                                                </label>

                                                {/* Teacher Card */}
                                                <label className="relative cursor-pointer">
                                                    <input type="radio" name="role" value="teacher" className="peer hidden" required />
                                                    <div className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-500 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition">
                                                        <span className="text-3xl">👨‍🏫</span>
                                                        <p className="mt-2 font-bold">Teacher</p>
                                                        <p className="text-xs text-gray-500">Guide & Inspire</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-yellow-400"
                                    required
                                />

                                {formType === "login" && forgotPasswordStep === 0 && (
                                    <div
                                        className="text-sm text-blue-600 cursor-pointer text-right hover:underline"
                                        onClick={() => setForgotPasswordStep(1)}
                                    >
                                        Forgot Password?
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-yellow-400 text-blue-900 font-bold py-2 rounded-lg hover:bg-yellow-300 transition"
                                >
                                    {formType === "login" ? "Login" : "Register"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}




            <CookieBanner />


        </div >
    );
};

export default Landing;
