import React, { useRef, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import Swal from 'sweetalert2';

const ChartShareSection = ({ darkMode, chartData, chartOptions }) => {
    const barRef = useRef(null);
    const lineRef = useRef(null);
    const pieRef = useRef(null);

    const [shareEmail, setShareEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sentTo, setSentTo] = useState(null);

    const [selectedCharts, setSelectedCharts] = useState({
        bar: false,
        line: false,
        pie: false,
    });

    const handleCheckboxChange = (chartType) => {
        setSelectedCharts((prev) => ({
            ...prev,
            [chartType]: !prev[chartType],
        }));
    };

    const isValidChartData =
        chartData &&
        Array.isArray(chartData.labels) &&
        Array.isArray(chartData.datasets) &&
        chartData.datasets.length > 0 &&
        Array.isArray(chartData.datasets[0].data);

    if (!isValidChartData) {
        return (
            <div
                className={`p-6 rounded-2xl shadow-xl text-center font-semibold text-red-500 border ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
                    }`}
            >
                ⚠️ Chart data is missing or invalid. Please upload a valid Excel file.
            </div>
        );
    }

    const handleShare = async () => {
        if (!shareEmail) {
            Swal.fire({
                icon: "warning",
                title: "Email Required",
                text: "Please enter an email to send charts!",
            });
            return;
        }

        const selected = [];
        if (selectedCharts.bar && barRef.current)
            selected.push({ type: "Bar Chart", image: barRef.current.toBase64Image() });
        if (selectedCharts.line && lineRef.current)
            selected.push({ type: "Line Chart", image: lineRef.current.toBase64Image() });
        if (selectedCharts.pie && pieRef.current)
            selected.push({ type: "Pie Chart", image: pieRef.current.toBase64Image() });

        if (selected.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No Chart Selected",
                text: "Please select at least one chart to share.",
            });
            return;
        }

        const result = await Swal.fire({
            title: "Confirm Share",
            text: `Send selected charts to ${shareEmail}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Send",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        setIsSending(true);

        try {
            const res = await fetch("http://localhost:5000/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: shareEmail,
                    charts: selected,
                    key: "excelapi_49fs8hd2",
                }),
            });

            if (res.ok) {
                setSentTo(shareEmail);
                setShareEmail("");

                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: `Charts sent to ${shareEmail}`,
                    timer: 3000,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed to Send",
                    text: "Server responded with an error. Please try again.",
                });
            }
        } catch (err) {
            console.error("❌ Error:", err);
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Something went wrong while sending.",
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={`max-w-6xl mx-auto ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} p-6 rounded-2xl shadow-xl border ${darkMode ? "border-gray-700" : "border-gray-200"} transition-all duration-300`}>
            <h2 className="text-2xl font-bold mb-2 text-center">📊 Select & Share Multiple Charts</h2>

            <div className="flex justify-center gap-6 mb-4 text-sm">
                <label><input type="checkbox" checked={selectedCharts.bar} onChange={() => handleCheckboxChange("bar")} className="mr-2" />Bar</label>
                <label><input type="checkbox" checked={selectedCharts.line} onChange={() => handleCheckboxChange("line")} className="mr-2" />Line</label>
                <label><input type="checkbox" checked={selectedCharts.pie} onChange={() => handleCheckboxChange("pie")} className="mr-2" />Pie</label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {selectedCharts.bar && (
                    <div className="rounded-xl border p-4 shadow bg-white dark:bg-gray-800 max-h-[300px] overflow-hidden">
                        <h4 className="text-center font-semibold mb-2">Bar Chart</h4>
                        <Bar ref={barRef} data={chartData} options={chartOptions} />
                    </div>
                )}
                {selectedCharts.line && (
                    <div className="rounded-xl border p-4 shadow bg-white dark:bg-gray-800 max-h-[300px] overflow-hidden">
                        <h4 className="text-center font-semibold mb-2">Line Chart</h4>
                        <Line ref={lineRef} data={chartData} options={chartOptions} />
                    </div>
                )}
                {selectedCharts.pie && (
                    <div className="rounded-xl border p-4 shadow bg-white dark:bg-gray-800 max-h-[300px] overflow-hidden">
                        <h4 className="text-center font-semibold mb-2">Pie Chart</h4>
                        <Pie
                            ref={pieRef}
                            data={{
                                labels: chartData.labels,
                                datasets: [
                                    {
                                        label: "Pie",
                                        data: chartData.datasets[0].data,
                                        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
                                    },
                                ],
                            }}
                            options={chartOptions}
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                    type="email"
                    placeholder="Enter email to share selected charts..."
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className={`flex-grow px-4 py-3 rounded-lg border w-full ${darkMode
                        ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                        : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"}`}
                />
                <button
                    onClick={handleShare}
                    disabled={isSending}
                    className={`bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow font-semibold w-full sm:w-auto ${isSending ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {isSending ? "Sending..." : "📧 Share Selected"}
                </button>
            </div>
        </div>
    );
};

export default ChartShareSection;
