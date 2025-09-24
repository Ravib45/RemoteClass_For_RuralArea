// // src/components/AnimatedNumbers.jsx
// import React from "react";

// const AnimatedNumbers = () => {
//     const numbers = Array.from({ length: 50 }, () =>
//         Math.floor(Math.random() * 100)
//     );

//     return (
//         <div className="absolute top-[-100px] left-0 w-full h-[calc(100%+200px)] overflow-hidden z-0 pointer-events-none">
//             {numbers.map((num, index) => (
//                 <span
//                     key={index}
//                     className="absolute text-white/10 font-mono animate-fall"
//                     style={{
//                         left: `${Math.random() * 100}%`,
//                         animationDelay: `${Math.random() * 5}s`,
//                         fontSize: `${12 + Math.random() * 24}px`,
//                     }}
//                 >
//                     {num}
//                 </span>
//             ))}
//         </div>
//     );
// };

// export default AnimatedNumbers;
