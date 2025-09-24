// src/components/PlatformHighlights.jsx
import { useRef, useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaFileAlt, FaChartBar, FaSmile, FaDownload } from "react-icons/fa";

const stats = [
    { label: "Files Processed", value: 12500, icon: <FaFileAlt />, color: "#facc15" },
    { label: "Charts Generated", value: 6800, icon: <FaChartBar />, color: "#34d399" },
    { label: "Happy Users", value: 4300, icon: <FaSmile />, color: "#60a5fa" },
    { label: "Reports Exported", value: 9500, icon: <FaDownload />, color: "#f472b6" },
];

export default function PlatformHighlights() {
    const refs = stats.map(() => useRef());
    const [hasStarted, setHasStarted] = useState(stats.map(() => false));

    useEffect(() => {
        refs.forEach((ref, i) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setHasStarted(prev => {
                            const updated = [...prev];
                            updated[i] = true;
                            return updated;
                        });
                        observer.unobserve(entry.target);
                    }
                },
                { threshold: 0.3 }
            );
            if (ref.current) observer.observe(ref.current);
        });
    }, []);

    return (
        <section className="py-16 text-white">
            <h2 className="text-center text-3xl font-bold mb-12 text-yellow-300">📈 Platform Highlights</h2>

            <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 px-4 md:grid md:grid-cols-4 md:px-0">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        ref={refs[i]}
                        className="w-[45%] sm:w-[40%] md:w-auto bg-gradient-to-br from-[#23234c] to-[#1c1c3a] rounded-xl py-6 px-4 shadow-lg text-center space-y-3"
                    >


                        <div className="text-yellow-300 text-3xl md:text-4xl mb-1">{stat.icon}</div>
                        <h3 className="text-2xl md:text-4xl font-extrabold text-yellow-300">
                            {hasStarted[i] ? <CountUp end={stat.value} duration={2.5} /> : "0"}
                        </h3>
                        <p className="text-sm font-medium text-gray-200">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
