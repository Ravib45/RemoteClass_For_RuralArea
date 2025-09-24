// src/pages/SmartAnalytics.jsx
import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF194C'];

export default function SmartAnalytics() {
    const [data, setData] = useState([]);
    const [chartType, setChartType] = useState('bar');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const jsonData = XLSX.utils.sheet_to_json(ws);
            const formatted = jsonData.map(row => ({ name: row.name || row.label, value: +row.value }));
            setData(formatted);
        };
        reader.readAsBinaryString(file);
    };

    const exportAsImage = async () => {
        const chart = document.getElementById('chart-area');
        const canvas = await html2canvas(chart);
        const image = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(image, 'PNG', 10, 10, 190, 100);
        pdf.save('analytics-report.pdf');
    };

    const renderChart = () => {
        if (!data || data.length === 0) return <p className="text-center text-gray-400">Upload data to see charts</p>;
        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} margin={{ top: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data} margin={{ top: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#00C49F" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">📊 Smart Analytics</h2>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700"
                />

                <div className="flex gap-2">
                    {['bar', 'line', 'pie'].map(type => (
                        <button
                            key={type}
                            onClick={() => setChartType(type)}
                            className={`px-4 py-2 rounded ${chartType === type ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-white'} transition`}
                        >
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>

                <button onClick={exportAsImage} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    <Download size={18} /> Export PDF
                </button>
            </div>

            <div id="chart-area" className="bg-white dark:bg-gray-800 rounded shadow p-4">
                {renderChart()}
            </div>
        </div>
    );
}
