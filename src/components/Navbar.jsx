// // src/components/Navbar.jsx
// import React, { useState } from "react";
// import { Menu, X } from "lucide-react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//     const [open, setOpen] = useState(false);

//     return (
//         <header className="w-full fixed top-0 left-0 z-50 bg-white/10 backdrop-blur-md text-white shadow-md">
//             <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
//                 <Link to="/" className="text-2xl font-bold tracking-wide">
//                     Excel <span className="text-yellow-300">Analytics</span>
//                 </Link>

//                 <div className="md:hidden" onClick={() => setOpen(!open)}>
//                     {open ? <X size={28} /> : <Menu size={28} />}
//                 </div>

//                 <nav className={`flex-col md:flex-row md:flex md:items-center absolute md:static top-16 left-0 w-full md:w-auto bg-indigo-700 md:bg-transparent transition-all ${open ? "flex" : "hidden"}`}>
//                     <Link to="#features" className="block px-6 py-2 md:mx-4 hover:text-yellow-300 transition">Features</Link>
//                     <Link to="#about" className="block px-6 py-2 md:mx-4 hover:text-yellow-300 transition">About</Link>
//                     <Link to="#contact" className="block px-6 py-2 md:mx-4 hover:text-yellow-300 transition">Contact</Link>
//                 </nav>
//             </div>
//         </header>
//     );
// };

// export default Navbar;
