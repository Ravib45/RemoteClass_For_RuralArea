// src/pages/Landing.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Typewriter } from "react-simple-typewriter";
import animationData from "../assets/animations/Animation.json";
import logoAnimation from "../assets/animations/logo.json";
import "../styles/landingBubbles.css";
import CountUp from "react-countup";
import { motion } from "framer-motion";



const testimonials = [
    {
        name: "Priya R.",
        comment: "This tool helped me automate all my Excel charting work in minutes!",
    },
    {
        name: "Ravi K.",
        comment: "Loved the 3D visuals and export options. Perfect for reports.",
    },
    {
        name: "Ananya S.",
        comment: "So easy to use! Login, upload, and boom – charts!"
    },
    {
        name: "Priya R.",
        comment: "This tool helped me automate all my Excel charting work in minutes!",
    },
    {
        name: "Ravi K.",
        comment: "Loved the 3D visuals and export options. Perfect for reports.",
    },
    {
        name: "Ananya S.",
        comment: "So easy to use! Login, upload, and boom – charts!"
    }
];

const Landing = () => {
    const [formType, setFormType] = useState(null);
    const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true); // true = dark by default
    const [showFeedback, setShowFeedback] = useState(false);



    const handleAuth = (e) => {
        e.preventDefault();
        const username = e.target.username?.value;
        const password = e.target.password?.value;

        if (formType === "login") {
            if (username === "testuser" && password === "123456") {
                localStorage.setItem("loggedIn", "true");
                navigate("/dashboard");
            } else {
                alert("Invalid credentials. Try username: testuser, pass: 123456");
            }
        } else {
            alert("Registered successfully (dummy)");
            setFormType(null);
        }
    };

    return (
        <div className={`${darkMode ? "bg-gradient-to-br from-indigo-800 via-purple-700 to-blue-900 text-white" : "bg-white text-black-800"} transition-colors duration-500`}>
            <div className="absolute inset-0 -z-10">
                <div className="bubbles"></div>
            </div>

            {/* 🌐 Navbar */}
            <nav className="w-full fixed top-0 left-0 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-white/10 shadow-md z-50">
                <div className="flex items-center gap-2">
                    <Player autoplay loop src={logoAnimation} style={{ height: "40px", width: "40px" }} />
                    <span className="text-xl font-bold text-yellow-300">ExcelAnalytics</span>
                </div>
                <div className="hidden md:flex space-x-6">
                    <a href="#" className="hover:text-yellow-300 font-medium">Home</a>
                    <a href="#features" className="hover:text-yellow-300 font-medium">Features</a>
                    <button onClick={() => setFormType("login")} className="hover:text-yellow-300 font-medium">Login</button>
                    <button onClick={() => setFormType("register")} className="hover:text-yellow-300 font-medium">Register</button>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="ml-4 px-3 py-1 rounded-full bg-white/20 hover:bg-yellow-300 transition text-sm font-medium text-white"
                    >
                        {darkMode ? "🌙 Dark" : "☀️ Light"}
                    </button>

                </div>
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
                <div className="md:hidden fixed top-0 right-0 w-64 h-full bg-[#1c1c2b] bg-opacity-90 backdrop-blur-xl text-white shadow-2xl z-50 p-6 flex flex-col gap-6 animate-slideIn rounded-l-3xl border-l border-purple-700/40">

                    {/* ❌ Close Button */}
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-4xl text-gray-400 hover:text-red-500 self-end"
                        aria-label="Close menu"
                    >
                        ×
                    </button>

                    {/* 🌐 Menu Links */}
                    <a href="#" className="flex items-center gap-2 hover:text-yellow-400 transition">
                        <i className="fas fa-home"></i> Home
                    </a>
                    <a href="#features" className="flex items-center gap-2 hover:text-yellow-400 transition">
                        <i className="fas fa-chart-bar"></i> Features
                    </a>
                    <button
                        onClick={() => { setFormType("login"); setMobileMenuOpen(false); }}
                        className="flex items-center gap-2 hover:text-yellow-400 transition"
                    >
                        <i className="fas fa-sign-in-alt"></i> Login
                    </button>
                    <button
                        onClick={() => { setFormType("register"); setMobileMenuOpen(false); }}
                        className="flex items-center gap-2 hover:text-yellow-400 transition"
                    >
                        <i className="fas fa-user-plus"></i> Register
                    </button>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="ml-4 px-3 py-1 rounded-full bg-white/20 hover:bg-yellow-300 transition text-sm font-medium text-white"
                    >
                        {darkMode ? "🌙 Dark" : "☀️ Light"}
                    </button>

                </div>
            )}



            {/* 🔥 Hero Section */}
            <section className="pt-32 px-6 pb-20 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-lg">
                        Welcome to <span className="text-yellow-300">Excel Analytics</span>
                    </h1>
                    <p className="text-xl">
                        <Typewriter
                            words={["Upload Excel Data", "See 3D Charts", "Export Beautiful Reports"]}
                            loop={true}
                            cursor
                            cursorStyle="|"
                            typeSpeed={60}
                            deleteSpeed={40}
                            delaySpeed={1500}
                        />
                    </p>
                    <p className="text-gray-200 max-w-lg">
                        Build powerful dashboards with Excel files using stunning visuals, export options, and modern UI.
                    </p>
                    <div className="flex gap-4 justify-center md:justify-start">
                        <button onClick={() => setFormType("login")} className="bg-yellow-400 text-blue-900 font-semibold px-6 py-2 rounded-xl shadow hover:bg-yellow-300 transition">
                            Login
                        </button>
                        <button onClick={() => setFormType("register")} className="border border-white px-6 py-2 rounded-xl hover:bg-white hover:text-blue-800 transition">
                            Register
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <Player autoplay loop src={animationData} style={{ height: "350px", width: "350px" }} />
                </div>
            </section>





            <section className="px-6 py-16  text-white">
                <h2 className="text-center text-3xl font-bold text-yellow-300 mb-12">Why Choose ExcelAnalytics?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white/10 p-6 rounded-xl shadow-md hover:shadow-xl transition">
                        <i className="fas fa-upload text-yellow-300 text-4xl mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2">Easy Excel Upload</h3>
                        <p className="text-gray-300">Drag and drop your Excel sheet to instantly generate visual reports.</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-xl shadow-md hover:shadow-xl transition">
                        <i className="fas fa-chart-line text-yellow-300 text-4xl mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2">Interactive 3D Charts</h3>
                        <p className="text-gray-300">Explore animated charts that respond to user input and filters.</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-xl shadow-md hover:shadow-xl transition">
                        <i className="fas fa-download text-yellow-300 text-4xl mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2">One-Click Export</h3>
                        <p className="text-gray-300">Export visuals to PNG/PDF for client reports or documentation.</p>
                    </div>
                </div>
            </section>


            {/* 📊 Animated Counter Stats */}
            <section className=" py-16 text-white">
                <h2 className="text-center text-3xl font-bold mb-12">📈 Platform Highlights</h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: "Files Processed", value: 12500 },
                        { label: "Charts Generated", value: 6800 },
                        { label: "Happy Users", value: 4300 },
                        { label: "Reports Exported", value: 9500 },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white/10 backdrop-blur rounded-2xl py-6 px-4 shadow-lg hover:scale-105 transition-transform duration-300"
                        >
                            <h3 className="text-4xl font-extrabold text-yellow-300">
                                <CountUp end={stat.value} duration={2.5} />
                            </h3>
                            <p className="mt-2 text-sm font-medium text-white">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 📅 Upcoming Features Timeline */}
            <section className="px-6 py-16 text-white ">
                <h2 className="text-center text-3xl font-bold mb-12 text-yellow-300">🚀 Upcoming Features</h2>
                <div className="max-w-3xl mx-auto space-y-8 border-l-2 border-yellow-300 pl-6">
                    {[
                        {
                            date: "Aug 2025",
                            title: "Google Sheets Integration",
                            description: "Pull live data from your Sheets directly and visualize instantly."
                        },
                        {
                            date: "Sep 2025",
                            title: "AI Chart Insights",
                            description: "Get smart recommendations based on your uploaded Excel content."
                        },
                        {
                            date: "Oct 2025",
                            title: "Team Collaboration",
                            description: "Invite teammates, share dashboards, and collaborate live."
                        }
                    ].map((item, i) => (
                        <div key={i} className="relative">
                            <div className="absolute -left-[31px] top-1 w-5 h-5 rounded-full bg-yellow-300 shadow-lg"></div>
                            <h4 className="text-xl font-bold text-yellow-200">{item.date}</h4>
                            <h5 className="text-lg font-semibold mt-1">{item.title}</h5>
                            <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* Review */}
            <section className="px-4 py-16  relative overflow-hidden ">
                <h2 className="text-center text-3xl font-bold mb-10 text-yellow-300">What Our Users Say</h2>

                <div className="overflow-hidden w-full relative group">
                    <div
                        className="flex gap-6 animate-marquee-reverse group-hover:[animation-play-state:paused]"
                        style={{ animationDuration: "40s" }}
                    >
                        {[...testimonials, ...testimonials].map((t, i) => (
                            <div
                                key={i}
                                className="min-w-[300px] max-w-sm bg-gradient-to-br from-[#23234c] to-[#1c1c3a] text-white p-6 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-105"
                            >
                                <img
                                    src={`https://i.pravatar.cc/150?img=${i + 10}`}
                                    alt={t.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-yellow-300 mb-4"
                                />
                                <p className="italic text-gray-300 mb-4">"{t.comment}"</p>
                                <p className="font-bold text-yellow-400">{t.name}</p>
                                <div className="text-yellow-300 mt-1">⭐⭐⭐⭐⭐</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ❓ Frequently Asked Questions */}
            <section className="py-16 text-white">
                <h2 className="text-center text-3xl font-bold mb-10 text-yellow-300">FAQs</h2>
                <div className="max-w-4xl mx-auto space-y-6">
                    {[
                        {
                            q: "How do I upload an Excel file?",
                            a: "Just log in, click on 'Upload', and select your .xlsx file. Our system will do the rest!"
                        },
                        {
                            q: "Is there a limit to file size?",
                            a: "Yes, the max file size is 10MB to ensure smooth processing and quick chart rendering."
                        },
                        {
                            q: "Can I download the generated charts?",
                            a: "Absolutely! You can export them as PNG or PDF with a single click."
                        },
                        {
                            q: "Is it mobile-friendly?",
                            a: "Yes, our platform is fully responsive and works great on phones and tablets."
                        }
                    ].map((faq, i) => (
                        <details key={i} className="bg-white/5 px-6 py-4 rounded-xl shadow hover:shadow-xl transition">
                            <summary className="cursor-pointer text-lg font-semibold text-yellow-300">{faq.q}</summary>
                            <p className="mt-2 text-gray-200">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </section>

            {/* 📨 Newsletter Subscription */}
            <section className=" py-16 text-white">
                <h2 className="text-center text-3xl font-bold mb-6 text-yellow-300">Subscribe to our Newsletter</h2>
                <p className="text-center text-gray-300 mb-8 max-w-xl mx-auto">
                    Stay updated with new features, chart templates, and tips on Excel automation. No spam, we promise! ✨
                </p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        alert("You're subscribed! ✅");
                        e.target.reset();
                    }}
                    className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-4 px-6"
                >
                    <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 rounded-lg outline-none text-gray-800 focus:ring-2 ring-yellow-400"
                    />
                    <button
                        type="submit"
                        className="bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 transition"
                    >
                        Subscribe
                    </button>
                </form>
            </section>

            <footer className=" text-white py-14 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

                    {/* 🔥 Branding */}
                    <div>
                        <h3 className="text-yellow-300 text-2xl font-extrabold mb-3">ExcelAnalytics</h3>
                        <p className="text-sm text-gray-400">Turning Excel chaos into beautiful visual reports ⚡</p>
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
                        <h4 className="text-yellow-300 font-semibold mb-2">🌍 Global Users</h4>
                        <div className="relative w-full h-36 rounded-lg overflow-hidden shadow-md border border-white/10">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1024px-World_map_-_low_resolution.svg.png"
                                alt="World Map"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-[65%] left-[70%] w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                            <div className="absolute top-[35%] left-[25%] w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Used in <span className="text-yellow-300 font-bold">50+ countries</span></p>
                    </div>
                </div>

                {/* 🧩 Bottom Line */}
                <div className="text-center text-xs text-gray-500 border-t border-white/10 mt-12 pt-4">
                    &copy; {new Date().getFullYear()} ExcelAnalytics. All rights reserved.
                </div>
            </footer>


            {/* 🔐 Auth Modal */}
            {
                formType && (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                        <div className="bg-white text-gray-800 w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fadeIn relative">
                            <button onClick={() => { setFormType(null); setForgotPasswordStep(0); }} className="absolute top-3 right-4 text-xl text-gray-400 hover:text-red-500">×</button>
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
                                    {forgotPasswordStep === 1 && (
                                        <>
                                            <p className="text-sm text-gray-700">OTP sent to your registered email.</p>
                                            <div className="flex gap-2 justify-center">
                                                {[...Array(4)].map((_, i) => (
                                                    <input
                                                        key={i}
                                                        maxLength={1}
                                                        type="text"
                                                        className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg"
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setForgotPasswordStep(2)}
                                                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-500 transition"
                                            >
                                                Submit OTP
                                            </button>
                                        </>
                                    )}
                                    {forgotPasswordStep === 2 && (
                                        <>
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-yellow-400"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-yellow-400"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    alert("Password successfully reset");
                                                    setForgotPasswordStep(0);
                                                    setFormType(null);
                                                }}
                                                className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-500 transition"
                                            >
                                                Reset Password
                                            </button>
                                        </>
                                    )}
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
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-yellow-400"
                                            required
                                        />
                                    )}
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-yellow-400"
                                        required
                                    />
                                    {formType === "login" && forgotPasswordStep === 0 && (
                                        <div className="text-sm text-blue-600 cursor-pointer text-right hover:underline" onClick={() => setForgotPasswordStep(1)}>
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
                )
            }
            {/* 💬 Floating Feedback Widget */}
            {!formType && (
                <>
                    {/* Feedback Button */}
                    <button
                        onClick={() => setShowFeedback(true)}
                        className="fixed bottom-6 right-6 z-50 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-4 py-3 rounded-full shadow-lg transition"
                    >
                        💬
                    </button>

                    {/* Feedback Popup */}
                    {showFeedback && (
                        <div className="fixed bottom-20 right-6 bg-white text-gray-800 rounded-xl shadow-2xl p-6 w-80 z-50 animate-fadeIn">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Feedback</h3>
                                <button
                                    onClick={() => setShowFeedback(false)}
                                    className="text-xl text-gray-400 hover:text-red-500"
                                >
                                    ×
                                </button>
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    alert("Thanks for your feedback! 🙌");
                                    setShowFeedback(false);
                                }}
                                className="space-y-4"
                            >
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 ring-yellow-400 outline-none"
                                />
                                <textarea
                                    placeholder="Your Feedback"
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 ring-yellow-400 outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-2 rounded-md transition"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    )}
                </>
            )}

        </div >
    );
};

export default Landing;
