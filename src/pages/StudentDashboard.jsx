import React, { useState, useEffect } from "react";
import {
    Home,
    BookOpen,
    FileText,
    ClipboardList,
    Calendar,
    Bell,
    User,
    LogOut,
    Clock,
    Award,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Sun,
    Moon,
    Grid,
    MessageSquare,
    BarChart2,
    CalendarDays,
    UploadCloud,
    File,
} from "lucide-react";

// Helper components for a cleaner look
const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 ${color} transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">{title}</h3>
            {icon}
        </div>
        <p className="text-3xl font-extrabold mt-2 text-gray-800 dark:text-gray-100">{value}</p>
    </div>
);

const BadgeCard = ({ title, description, icon, color }) => (
    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center">
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <h4 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h4>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
);

const StudentDashboard = () => {
    const [activePage, setActivePage] = useState("overview");
    const [darkMode, setDarkMode] = useState(false);

    // Load dark mode preference from local storage on component mount
    useEffect(() => {
        const isDarkMode = localStorage.getItem("darkMode") === "true";
        setDarkMode(isDarkMode);
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, []);

    // Effect to apply/remove dark mode class on HTML element
    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // Dummy Data
    const student = { name: "Anjali Sharma", role: "Student", email: "anjali.sharma@edu.in" };

    const classes = [
        { id: 1, subject: "Mathematics", teacher: "Mr. Singh", progress: 65 },
        { id: 2, subject: "Science", teacher: "Ms. Preeti", progress: 80 },
        { id: 3, subject: "English Literature", teacher: "Mr. Roy", progress: 95 },
        { id: 4, subject: "Computer Science", teacher: "Dr. Rao", progress: 30 },
    ];

    const assignments = [
        { id: 1, title: "Algebra Homework Set 5", due: "2025-09-30", status: "Pending", subject: "Mathematics" },
        { id: 2, title: "Science Project Proposal", due: "2025-10-05", status: "Submitted", subject: "Science" },
        { id: 3, title: "Essay on Colonialism", due: "2025-10-15", status: "Pending", subject: "English" },
    ];

    const resources = [
        { id: 1, title: "Algebra I Lecture Notes", type: "PDF", size: "1.2 MB", course: "Mathematics" },
        { id: 2, title: "Gravity Simulation Video", type: "MP4", size: "25 MB", course: "Science" },
        { id: 3, title: "The Great Gatsby.pdf", type: "PDF", size: "850 KB", course: "English Literature" },
    ];

    const announcements = [
        { id: 1, msg: "🔔 Science Project due 30th Sept! Final Reminder.", date: "2025-09-20" },
        { id: 2, msg: "⚠️ Maths Quiz rescheduled to 28th Sept. Check new syllabus.", date: "2025-09-18" },
        { id: 3, msg: "✨ Library now open until 7 PM on weekdays.", date: "2025-09-15" },
    ];

    const timetable = [
        { day: "Monday", time: "10:00 AM", subject: "Mathematics", teacher: "Mr. Singh" },
        { day: "Tuesday", time: "11:00 AM", subject: "Science", teacher: "Ms. Preeti" },
        { day: "Wednesday", time: "09:00 AM", subject: "English Literature", teacher: "Mr. Roy" },
        { day: "Thursday", time: "10:00 AM", subject: "Computer Science", teacher: "Dr. Rao" },
        { day: "Friday", time: "11:00 AM", subject: "Mathematics", teacher: "Mr. Singh" },
    ];

    const badges = [
        { title: "Course Master", description: "Completed English Literature with an A", icon: <Award size={32} />, color: "bg-yellow-200 text-yellow-600" },
        { title: "On-Time Ace", description: "Submitted 10 consecutive assignments on time", icon: <Clock size={32} />, color: "bg-blue-200 text-blue-600" },
        { title: "Science Whiz", description: "Scored 90%+ on all Science quizzes", icon: <ClipboardList size={32} />, color: "bg-green-200 text-green-600" },
    ];

    const menu = [
        { id: "overview", label: "Dashboard", icon: <Home size={20} /> },
        { id: "courses", label: "My Courses", icon: <BookOpen size={20} /> },
        { id: "assignments", label: "Assignments", icon: <FileText size={20} /> },
        { id: "progress", label: "Progress", icon: <BarChart2 size={20} /> },
        { id: "timetable", label: "Timetable", icon: <CalendarDays size={20} /> },
        { id: "resources", label: "Resources", icon: <Download size={20} /> },
        { id: "achievements", label: "Achievements", icon: <Award size={20} /> },
        { id: "announcements", label: "Announcements", icon: <Bell size={20} /> },
        { id: "profile", label: "Profile", icon: <User size={20} /> },
    ];

    const pendingAssignmentsCount = assignments.filter((a) => a.status === "Pending").length;
    const totalAssignments = assignments.length;
    const completedAssignments = totalAssignments - pendingAssignmentsCount;

    const renderPageContent = () => {
        switch (activePage) {
            case "overview":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Classes Enrolled"
                            value={classes.length}
                            icon={<BookOpen size={24} className="text-blue-500" />}
                            color="border-blue-500"
                        />
                        <StatCard
                            title="Pending Assignments"
                            value={pendingAssignmentsCount}
                            icon={<FileText size={24} className="text-red-500" />}
                            color="border-red-500"
                        />
                        <StatCard
                            title="Assignments Completed"
                            value={completedAssignments}
                            icon={<CheckCircle size={24} className="text-green-500" />}
                            color="border-green-500"
                        />
                        <StatCard
                            title="Overall Grade"
                            value="A-"
                            icon={<Award size={24} className="text-yellow-500" />}
                            color="border-yellow-500"
                        />
                        <div className="lg:col-span-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
                            <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center">
                                <Clock size={20} className="mr-2" /> Next Live Session
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">Your **Mathematics** class starts in **10 minutes**.</p>
                            <button className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition duration-150 shadow-md">
                                Join Live Class Now
                            </button>
                        </div>
                    </div>
                );
            case "courses":
                return (
                    <div className="space-y-4">
                        {classes.map((cls) => (
                            <div
                                key={cls.id}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center transform transition duration-300 hover:shadow-xl hover:translate-y-[-2px]"
                            >
                                <div className="flex items-center w-full">
                                    <BookOpen size={32} className="text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{cls.subject}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Teacher: {cls.teacher}</p>
                                    </div>
                                    <div className="w-full md:w-1/3 mt-4 md:mt-0 ml-0 md:ml-4">
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                            <div
                                                className="h-2 bg-green-500 rounded-full"
                                                style={{ width: `${cls.progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">{cls.progress}% Completed</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                                    <button className="px-5 py-2 rounded-full font-bold shadow-md bg-blue-600 text-white hover:bg-blue-700 transition duration-150">
                                        View Syllabus
                                    </button>
                                    <button className="px-5 py-2 rounded-full font-bold shadow-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150">
                                        View Resources
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case "assignments":
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                            <thead className="bg-blue-700 dark:bg-blue-900 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Title</th>
                                    <th className="px-6 py-4 text-left font-semibold">Subject</th>
                                    <th className="px-6 py-4 font-semibold text-center">Due Date</th>
                                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map((a) => (
                                    <tr key={a.id} className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-150">
                                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-200">{a.title}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{a.subject}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-center">{a.due}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-full ${a.status === "Pending"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {a.status === "Pending" ? <XCircle size={16} className="mr-1" /> : <CheckCircle size={16} className="mr-1" />}
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium">
                                                {a.status === "Pending" ? "Upload File" : "View Submission"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case "progress":
                return (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">📊 Performance Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Overall Assignment Completion</h4>
                                <div className="flex items-center space-x-4">
                                    <div className="w-24 h-24 relative">
                                        {/* Placeholder for a progress ring */}
                                        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                                        <div
                                            className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-green-500"
                                            style={{
                                                clipPath: `inset(0 0 0 50%)`,
                                                transform: `rotate(${((completedAssignments / totalAssignments) * 360) || 0}deg)`,
                                            }}
                                        ></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800 dark:text-gray-100">
                                            {((completedAssignments / totalAssignments) * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        You have completed {completedAssignments} out of {totalAssignments} total assignments so far.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Subject-wise Progress</h4>
                                <div className="space-y-3">
                                    {classes.map((cls) => (
                                        <div key={cls.id}>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600 dark:text-gray-300">{cls.subject}</span>
                                                <span className="font-semibold text-gray-800 dark:text-gray-100">{cls.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                                <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${cls.progress}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "timetable":
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">📅 Weekly Schedule</h3>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {timetable.map((item, index) => (
                                    <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
                                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 flex items-center">
                                            <CalendarDays size={20} className="mr-2 text-blue-500" />
                                            {item.day}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 ml-7">{item.time}</p>
                                        <p className="text-gray-700 dark:text-gray-200 mt-2 ml-7">
                                            <strong className="font-medium">{item.subject}</strong> with {item.teacher}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "resources":
                return (
                    <div className="space-y-4">
                        {resources.map((file) => (
                            <div
                                key={file.id}
                                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex justify-between items-center hover:shadow-xl transition duration-300"
                            >
                                <div className="flex items-center">
                                    <File size={32} className="mr-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{file.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{file.course} &bull; {file.size}</p>
                                    </div>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-150 shadow-md">
                                    <Download size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                );
            case "achievements":
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">🏆 My Badges</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {badges.map((badge, index) => (
                                <BadgeCard
                                    key={index}
                                    title={badge.title}
                                    description={badge.description}
                                    icon={badge.icon}
                                    color={badge.color}
                                />
                            ))}
                        </div>
                    </div>
                );
            case "announcements":
                return (
                    <div className="space-y-4">
                        {announcements.map((a) => (
                            <div
                                key={a.id}
                                className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-xl shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition duration-150"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg flex items-center">
                                        <Bell size={20} className="text-yellow-500 mr-2 flex-shrink-0" />
                                        {a.msg}
                                    </p>
                                    <span className="text-xs text-gray-600 dark:text-gray-300">{a.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case "profile":
                return (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg mx-auto">
                        <div className="flex flex-col items-center mb-6">
                            <img
                                src="https://i.pravatar.cc/100?img=4"
                                alt="Student Avatar"
                                className="w-24 h-24 rounded-full border-4 border-blue-500 dark:border-blue-400 shadow-md"
                            />
                            <h3 className="text-2xl font-bold mt-3 text-gray-800 dark:text-gray-100">{student.name}</h3>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">{student.role}</p>
                        </div>

                        <div className="space-y-4">
                            <p className="flex items-center text-gray-700 dark:text-gray-200">
                                <User size={20} className="mr-3 text-blue-500 dark:text-blue-400" />
                                <strong>Username:</strong> Anjali_S
                            </p>
                            <p className="flex items-center text-gray-700 dark:text-gray-200">
                                <Mail size={20} className="mr-3 text-blue-500 dark:text-blue-400" />
                                <strong>Email:</strong> {student.email}
                            </p>
                            <p className="flex items-center text-gray-700 dark:text-gray-200">
                                <BookOpen size={20} className="mr-3 text-blue-500 dark:text-blue-400" />
                                <strong>Enrolled:</strong> {classes.length} Courses
                            </p>
                        </div>
                        <button className="mt-6 w-full bg-indigo-600 text-white px-4 py-3 rounded-full font-semibold hover:bg-indigo-700 transition shadow-md">
                            Edit Profile Details
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-blue-900 to-indigo-800 text-white flex flex-col p-6 shadow-xl flex-shrink-0">
                <h2 className="text-2xl font-extrabold mb-10 text-yellow-400">🎓 RRC Student Portal</h2>
                <nav className="flex flex-col space-y-3 flex-grow">
                    {menu.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition duration-200 ease-in-out ${activePage === item.id
                                ? "bg-yellow-400 text-blue-900 font-extrabold shadow-md transform scale-[1.02]"
                                : "hover:bg-indigo-700 text-gray-200"
                                }`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
                <div className="mt-auto pt-6 flex flex-col space-y-3">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition duration-200 hover:bg-indigo-700 text-gray-200"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-150 shadow-md">
                        <LogOut size={20} /> Secure Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                {/* Topbar */}
                <div className="flex justify-between items-center mb-10 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border-b-4 border-blue-500">
                    <div>
                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Welcome Back, Anjali!</p>
                        <h1 className="text-4xl font-extrabold capitalize text-gray-800 dark:text-gray-100">
                            {menu.find(item => item.id === activePage)?.label}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">{student.name}</span>
                        <img
                            src="https://i.pravatar.cc/48?img=4"
                            alt="avatar"
                            className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-lg"
                        />
                    </div>
                </div>

                {/* Pages Content */}
                {renderPageContent()}
            </main>
        </div>
    );
};

export default StudentDashboard;
