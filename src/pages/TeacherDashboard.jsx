    import React, { useState } from "react";
    import { BookOpen, Users, ClipboardList, BarChart3, Calendar, Megaphone, Settings, LogOut, Upload, ArrowRight, Plus, Mail, CheckCircle, Clock, Search, X, Menu } from "lucide-react";

    const TeacherDashboard = () => {
        const [isSidebarOpen, setIsSidebarOpen] = useState(false);

        // Function to toggle the sidebar's open/closed state
        const toggleSidebar = () => {
            setIsSidebarOpen(!isSidebarOpen);
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-950 to-black text-white font-sans antialiased flex flex-col lg:flex-row">

                {/*
                * Sidebar Component
                * The `transform` and `transition` classes handle the slide-in/slide-out effect.
                * It's hidden on small screens by default and becomes static on large screens.
                */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 p-8 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:rounded-r-3xl lg:shadow-2xl lg:border-r lg:border-white/5`}
                >
                    {/* Header with hamburger and close buttons */}
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-extrabold text-amber-300 tracking-wide">👨‍🏫 Teacher Panel</h2>
                        <button onClick={toggleSidebar} className="lg:hidden text-zinc-400 hover:text-white transition">
                            <X size={28} />
                        </button>
                    </div>

                    {/* Navigation links */}
                    <nav className="flex-1 space-y-6 flex flex-col">
                        <a href="#courses" onClick={toggleSidebar} className="flex items-center gap-4 text-zinc-300 hover:text-amber-400 transition-all duration-300 transform hover:translate-x-1">
                            <BookOpen size={24} className="text-amber-300" /> <span className="text-lg">Courses</span>
                        </a>
                        <a href="#assignments" onClick={toggleSidebar} className="flex items-center gap-4 text-zinc-300 hover:text-amber-400 transition-all duration-300 transform hover:translate-x-1">
                            <ClipboardList size={24} className="text-teal-400" /> <span className="text-lg">Assignments</span>
                        </a>
                        <a href="#students" onClick={toggleSidebar} className="flex items-center gap-4 text-zinc-300 hover:text-amber-400 transition-all duration-300 transform hover:translate-x-1">
                            <Users size={24} className="text-blue-400" /> <span className="text-lg">Students</span>
                        </a>
                        <a href="#progress" onClick={toggleSidebar} className="flex items-center gap-4 text-zinc-300 hover:text-amber-400 transition-all duration-300 transform hover:translate-x-1">
                            <BarChart3 size={24} className="text-purple-400" /> <span className="text-lg">Progress</span>
                        </a>
                        <a href="#schedule" onClick={toggleSidebar} className="flex items-center gap-4 text-zinc-300 hover:text-amber-400 transition-all duration-300 transform hover:translate-x-1">
                            <Calendar size={24} className="text-lime-400" /> <span className="text-lg">Schedule</span>
                        </a>
                        <a href="#announcements" onClick={toggleSidebar} className="flex items-center gap-4 text-zinc-300 hover:text-amber-400 transition-all duration-300 transform hover:translate-x-1">
                            <Megaphone size={24} className="text-rose-400" /> <span className="text-lg">Announcements</span>
                        </a>
                        <a href="#resources" onClick={toggleSidebar} className="flex items-center gap-4 text-zinc-300 hover:text-amber-400 transition-all duration-300 transform hover:translate-x-1">
                            <Upload size={24} className="text-sky-400" /> <span className="text-lg">Resources</span>
                        </a>
                        <a href="#settings" onClick={toggleSidebar} className="flex items-center gap-4 text-zinc-300 hover:text-amber-400 transition-all duration-300 transform hover:translate-x-1">
                            <Settings size={24} className="text-gray-400" /> <span className="text-lg">Settings</span>
                        </a>
                    </nav>
                    <button className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-all duration-300 mt-12 group">
                        <LogOut size={20} className="transform group-hover:scale-110 transition-all duration-300" /> <span className="text-lg">Logout</span>
                    </button>
                </aside>

                {/* Semi-transparent overlay for mobile when sidebar is open */}
                {isSidebarOpen && (
                    <div
                        onClick={toggleSidebar}
                        className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    ></div>
                )}

                {/*
                * Main Content Area
                * Contains the dashboard header, search bar, and content sections.
                */}
                <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                    {/* Header with welcome message and mobile hamburger menu button */}
                    <header className="flex justify-between items-center mb-6 lg:mb-12">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Welcome, Teacher 👋</h1>
                        <button onClick={toggleSidebar} className="lg:hidden text-zinc-400 hover:text-white transition">
                            <Menu size={28} />
                        </button>
                    </header>

                    <p className="text-zinc-400 text-base md:text-lg mb-8">Your central hub for managing all your classes and students.</p>

                    {/* Search Bar */}
                    <div className="mt-8 mb-10 relative">
                        <input
                            type="text"
                            placeholder="Search for students, assignments, or courses..."
                            className="w-full bg-white/5 backdrop-blur-md p-4 rounded-full border border-white/10 text-white pl-12 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all duration-300"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                    </div>

                    {/* Quick Actions & Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-amber-300">Quick Actions</h2>
                            <div className="flex flex-wrap gap-4">
                                <button className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-6 py-3 bg-purple-600/80 text-white rounded-full hover:bg-purple-700/90 transition-all duration-300 transform hover:-translate-y-1">
                                    <Plus size={20} /> New Assignment
                                </button>
                                <button className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600/80 text-white rounded-full hover:bg-cyan-700/90 transition-all duration-300 transform hover:-translate-y-1">
                                    <Megaphone size={20} /> Post Announcement
                                </button>
                                <button className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-6 py-3 bg-green-600/80 text-white rounded-full hover:bg-green-700/90 transition-all duration-300 transform hover:-translate-y-1">
                                    <Mail size={20} /> Contact Student
                                </button>
                            </div>
                        </div>
                        {/* Stats */}
                        <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-around text-center">
                            <h3 className="text-lg font-bold text-zinc-300 mb-2">Total Students</h3>
                            <p className="text-5xl font-extrabold text-blue-400 transition-transform duration-300 transform hover:scale-110">120</p>
                        </div>
                    </div>

                    {/* Dynamic Content Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        {/* Recent Activity */}
                        <div className="bg-zinc-800 p-8 rounded-2xl shadow-lg border border-zinc-700">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                                <Clock size={24} /> Recent Activity
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-zinc-700 transition">
                                    <div className="p-2 rounded-full bg-green-600/20 text-green-400">
                                        <CheckCircle size={20} className="flex-shrink-0" />
                                    </div>
                                    <p className="text-zinc-300"><span className="font-semibold text-white">Jane Doe</span> submitted "Essay on World War II". <span className="text-xs block mt-1 text-zinc-500">2 minutes ago</span></p>
                                </li>
                                <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-zinc-700 transition">
                                    <div className="p-2 rounded-full bg-rose-600/20 text-rose-400">
                                        <Megaphone size={20} className="flex-shrink-0" />
                                    </div>
                                    <p className="text-zinc-300">You posted a new announcement: "Class Canceled." <span className="text-xs block mt-1 text-zinc-500">1 hour ago</span></p>
                                </li>
                                <li className="flex items-start gap-4 p-4 rounded-xl hover:bg-zinc-700 transition">
                                    <div className="p-2 rounded-full bg-teal-600/20 text-teal-400">
                                        <ClipboardList size={20} className="flex-shrink-0" />
                                    </div>
                                    <p className="text-zinc-300">New assignment "Algebra Homework" created. <span className="text-xs block mt-1 text-zinc-500">4 hours ago</span></p>
                                </li>
                            </ul>
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="bg-zinc-800 p-8 rounded-2xl shadow-lg border border-zinc-700">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                                <Calendar size={24} /> Upcoming Deadlines
                            </h2>
                            <ul className="space-y-4">
                                <li className="bg-zinc-700 p-4 rounded-xl border-l-4 border-l-amber-400 transition-transform duration-300 hover:scale-[1.02]">
                                    <h4 className="font-semibold text-lg mb-1">History Exam</h4>
                                    <p className="text-sm text-zinc-400">Due: October 25, 2025</p>
                                </li>
                                <li className="bg-zinc-700 p-4 rounded-xl border-l-4 border-l-teal-400 transition-transform duration-300 hover:scale-[1.02]">
                                    <h4 className="font-semibold text-lg mb-1">Lab Report Submission</h4>
                                    <p className="text-sm text-zinc-400">Due: November 1, 2025</p>
                                </li>
                                <li className="bg-zinc-700 p-4 rounded-xl border-l-4 border-l-blue-400 transition-transform duration-300 hover:scale-[1.02]">
                                    <h4 className="font-semibold text-lg mb-1">Final Project Proposal</h4>
                                    <p className="text-sm text-zinc-400">Due: November 15, 2025</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <section id="courses" className="bg-zinc-800 p-8 rounded-2xl shadow-lg border border-zinc-700 hover:bg-zinc-700 transition-colors duration-300">
                            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-amber-300">
                                <BookOpen size={24} /> Courses
                            </h2>
                            <p className="text-zinc-400 mb-4">Create, update, and manage your course materials and content.</p>
                            <a href="#" className="flex items-center gap-2 text-amber-300 hover:underline">
                                View Details <ArrowRight size={16} />
                            </a>
                        </section>
                        <section id="assignments" className="bg-zinc-800 p-8 rounded-2xl shadow-lg border border-zinc-700 hover:bg-zinc-700 transition-colors duration-300">
                            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-teal-400">
                                <ClipboardList size={24} /> Assignments
                            </h2>
                            <p className="text-zinc-400 mb-4">Create assignments and review student submissions for grading.</p>
                            <a href="#" className="flex items-center gap-2 text-teal-400 hover:underline">
                                View Details <ArrowRight size={16} />
                            </a>
                        </section>
                        <section id="students" className="bg-zinc-800 p-8 rounded-2xl shadow-lg border border-zinc-700 hover:bg-zinc-700 transition-colors duration-300">
                            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 text-blue-400">
                                <Users size={24} /> Student List
                            </h2>
                            <p className="text-zinc-400 mb-4">View and manage all your enrolled students and their profiles.</p>
                            <a href="#" className="flex items-center gap-2 text-blue-400 hover:underline">
                                View Details <ArrowRight size={16} />
                            </a>
                        </section>
                    </div>
                </main>
            </div>
        );
    };

    export default TeacherDashboard;
