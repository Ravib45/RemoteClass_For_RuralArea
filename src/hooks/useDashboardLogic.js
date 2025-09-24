// useDashboardLogic.js
import { useState, useEffect, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as THREE from 'three';

const useDashboardLogic = () => {
    // --- Core Data & Chart States ---
    // These states manage the raw data, the selected axes, and basic chart properties.
    // 💡 Change here for new core data elements or chart defaults.
    const [excelData, setExcelData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [xAxis, setXAxis] = useState("");
    const [yAxis, setYAxis] = useState("");
    const [chartType, setChartType] = useState("bar");
    const [chartTitle, setChartTitle] = useState("Chart Title");
    const [chartSubtitle, setChartSubtitle] = useState("Chart Subtitle");
    const [filename, setFilename] = useState("SmartReport"); // Stores the original filename

    // --- UI & UX States ---
    // These states control the visual aspects and user experience features.
    // 💡 Modify here for UI theme, search, animation, or layout changes.
    const [darkMode, setDarkMode] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [enableAnimation, setEnableAnimation] = useState(true);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [recentFiles, setRecentFiles] = useState(() => {
        const saved = localStorage.getItem("recentFiles");
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("chart"); // 'chart', 'data', 'settings', 'analytics', 'share', 'plugins', 'recent'
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile responsiveness

    // --- Chart Customization & Filtering States ---
    // These states handle specific visual customizations for charts and data filtering options.
    // 💡 Add or adjust states related to chart aesthetics (colors, lines) or advanced filtering.
    const [minValue, setMinValue] = useState(''); // State for min filter value
    const [maxValue, setMaxValue] = useState(''); // State for max filter value
    const [chartColor, setChartColor] = useState('#FF6384');
    const [annotationText, setAnnotationText] = useState("");
    const [lineTension, setLineTension] = useState(0.4); // For line charts
    const [pointRadius, setPointRadius] = useState(3); // For line charts

    // --- Auth & User States ---
    // States related to user authentication and session management.
    // 💡 Change here for different user roles, permissions, or login flows.
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);
    const [loginName, setLoginName] = useState("");

    // --- Advanced Features States ---
    // States for more complex functionalities like comparisons, history, voice, and templates.
    // 💡 Expand this section for new analytical features or integrations.
    const [compareX1, setCompareX1] = useState("");
    const [compareX2, setCompareX2] = useState("");
    const [exportHistory, setExportHistory] = useState([]);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [voiceResult, setVoiceResult] = useState("");
    const [savedTemplates, setSavedTemplates] = useState([]);
    const [shareEmail, setShareEmail] = useState("");
    const [recommendedChart, setRecommendedChart] = useState("No recommendation yet.");
    const [density, setDensity] = useState("comfortable"); // For table density
    const [whatIfScenario, setWhatIfScenario] = useState("");
    const [whatIfValue, setWhatIfValue] = useState(0);
    const [dateFilterStart, setDateFilterStart] = useState("");
    const [dateFilterEnd, setDateFilterEnd] = useState("");
    const [topN, setTopN] = useState("20"); // For Top N chart filtering
    const [customTopN, setCustomTopN] = useState(""); // For custom Top N input


    // --- Refs ---
    // These refs allow direct access to DOM elements, useful for libraries like Three.js or Chart.js.
    // 💡 Add new refs if you need to interact directly with specific DOM elements.
    const mountRef = useRef(null); // Ref for Three.js Canvas container
    const chartAreaRef = useRef(null); // Ref for chart screenshot area (used by html2canvas)
    const fileInputRef = useRef(null); // Ref for hidden file input element
    const chartRef = useRef(null); // Ref for Chart.js instance (canvas element)

    // --- Effects ---
    // `useEffect` hooks manage side effects, like local storage persistence, event listeners, or animations.
    // 💡 Review and modify these effects for initial data loading, cleanup, or new background processes.

    // Effect to load data from localStorage on component mount
    useEffect(() => {
        const savedRecentFiles = localStorage.getItem("recentFiles");
        if (savedRecentFiles) setRecentFiles(JSON.parse(savedRecentFiles));
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setShowLogin(false);
        }
        const savedTemplates = localStorage.getItem("savedDashboardTemplates");
        if (savedTemplates) {
            setSavedTemplates(JSON.parse(savedTemplates));
        }
    }, []);

    // Effect for keyboard shortcuts (Ctrl+U for file upload)
    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.ctrlKey && e.key === 'u' && fileInputRef.current) {
                e.preventDefault();
                fileInputRef.current.click();
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    // Effect for auto-refresh functionality
    useEffect(() => {
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                console.log("Auto-refreshing data...");
                // 💡 In a real app, you'd trigger data re-fetch or re-processing here.
            }, 30000);
        }
        return () => clearInterval(interval);
    }, [autoRefresh]);

    // Three.js Background Effect: Renders an animated sphere in the background.
    // 💡 Customize sphere geometry, material, lights, or animation here.
    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        const geometry = new THREE.SphereGeometry(1.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: darkMode ? 0x6a0dad : 0x00aaff, // Color changes with dark mode
            specular: 0x050505,
            shininess: 100,
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.002;
            const hue = (Date.now() * 0.00002) % 1; // Subtle color shift
            material.color.setHSL(hue, 0.6, darkMode ? 0.3 : 0.7);
            material.needsUpdate = true;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => { // Cleanup function for Three.js
            window.removeEventListener('resize', handleResize);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            scene.remove(sphere);
            scene.remove(ambientLight);
            scene.remove(directionalLight);
        };
    }, [darkMode]); // Re-run effect when darkMode changes

    // Set initial chart color to a gradient when chartRef is available
    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "#facc15");
        gradient.addColorStop(1, "#f59e0b");
        setChartColor(gradient);
    }, []);

    // --- Data Handling Functions ---
    // Functions responsible for loading, parsing, filtering, and sorting data.
    // 💡 Modify these functions if changing file types, data processing, or filter logic.

    const handleFileUpload = (e) => {
        if (!user) {
            alert("Please login to upload files.");
            if (e.target) e.target.value = null;
            return;
        }

        setLoading(true);
        const file = e.target.files[0];
        if (!file) {
            setLoading(false);
            return;
        }

        setFilename(file.name); // Set the currently active filename

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const names = wb.SheetNames;
            setSheetNames(names);
            setSelectedSheet(names[0]);

            const data = XLSX.utils.sheet_to_json(wb.Sheets[names[0]]);
            setExcelData(data); // Set the data for current view

            const cols = data.length > 0 ? Object.keys(data[0]) : [];
            setColumns(cols); // Set the columns for current view

            // --- Core changes for Recent Files integration ---

            // 1. Save the actual file data (data & columns) to localStorage under its filename
            try {
                localStorage.setItem(file.name, JSON.stringify({ data: data, columns: cols }));
            } catch (storageError) {
                console.error("Error saving file data to localStorage:", storageError);
                alert(`Could not save file data for "${file.name}" to your browser's storage. It might be too large.`);
                setLoading(false);
                if (e.target) e.target.value = null; // Clear file input
                return; // Stop processing further for this file
            }

            // 2. Create a metadata entry for the 'recentFiles' list
            const newRecentFileEntry = {
                name: file.name,
                date: new Date().toISOString(), // Use ISO string for consistent date storage
                size: file.size // ✅ Include file size for display in RecentFilesPanel
            };

            // 3. Update the 'recentFiles' list in state and localStorage
            // Ensure uniqueness and limit to, say, 5 recent files
            const updatedRecent = [
                newRecentFileEntry,
                ...recentFiles.filter(f => f.name !== file.name) // Remove if already exists
            ].slice(0, 5); // Keep only the latest 5 files

            setRecentFiles(updatedRecent);
            localStorage.setItem("recentFiles", JSON.stringify(updatedRecent));

            // --- End of Recent Files changes ---

            setLoading(false);
            if (e.target) e.target.value = null; // Clear file input after successful upload
        };

        reader.onerror = (error) => {
            console.error("File reading error:", error);
            alert("Failed to read file. Please try again.");
            setLoading(false);
            if (e.target) e.target.value = null; // Clear file input
        };

        reader.readAsBinaryString(file);
    };
    // Handles switching between sheets in an uploaded Excel file.
    const handleSheetChange = (sheetName) => {
        setSelectedSheet(sheetName);
        setLoading(true);
        const file = fileInputRef.current?.files[0];
        if (!file) {
            alert("No file currently loaded to switch sheets.");
            setLoading(false);
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
            setExcelData(data);
            if (data.length > 0) {
                setColumns(Object.keys(data[0]));
            } else {
                setColumns([]);
            }
            setLoading(false);
        };
        reader.onerror = (error) => {
            console.error("Sheet reading error:", error);
            alert("Failed to read sheet data.");
            setLoading(false);
        };
        reader.readAsBinaryString(file);
    };

    // Memoized filtered data based on search term, min/max values, and date range.
    // This re-calculates only when dependencies change.
    // 💡 Add new filtering conditions here.
    const filteredData = excelData.filter((row) => {
        const matchesSearch = Object.values(row).some((val) =>
            val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

        let matchesMinMax = true;
        if (yAxis) { // Only apply if yAxis is selected
            const value = parseFloat(row[yAxis]);
            if (!isNaN(value)) {
                if (minValue !== '' && value < parseFloat(minValue)) {
                    matchesMinMax = false;
                }
                if (maxValue !== '' && value > parseFloat(maxValue)) {
                    matchesMinMax = false;
                }
            }
        }

        let matchesDateRange = true;
        // Assuming a 'Date' column exists and is parseable.
        // 💡 Modify 'Date' to your actual date column name if different.
        if (dateFilterStart && dateFilterEnd && row['Date']) {
            try {
                const rowDate = new Date(row['Date']);
                const startDate = new Date(dateFilterStart);
                const endDate = new Date(dateFilterEnd);
                matchesDateRange = rowDate >= startDate && rowDate <= endDate;
            } catch (e) {
                // console.warn("Date parsing error or 'Date' column not found for filter:", e);
                matchesDateRange = true; // Don't filter if date is invalid or column missing/unparseable
            }
        }
        return matchesSearch && matchesMinMax && matchesDateRange;
    });

    // Memoized sorted data based on the current sort configuration.
    // This re-sorts only when `filteredData` or `sortConfig` changes.
    // 💡 Adjust sorting logic (e.g., custom sort for specific columns) here.
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0; // No sorting if no key is set
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // String comparison (case-insensitive for robustness)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        // Numeric comparison (handles potential non-numeric gracefully)
        const numA = parseFloat(aValue);
        const numB = parseFloat(bValue);
        if (!isNaN(numA) && !isNaN(numB)) {
            return sortConfig.direction === "asc" ? numA - numB : numB - numA;
        }
        return 0; // Fallback if values are not comparable
    });

    // --- Chart Logic ---
    // Functions and derived data specifically for chart generation and options.
    // 💡 This is the primary area to modify chart data aggregation or default options.

    // Generates chart data structure suitable for Chart.js based on selected axes and filtered data.
    // Uses `useCallback` to prevent unnecessary re-creations.
    // 💡 Modify grouping logic, dataset properties, or add new chart types here.
    const generateChartData = useCallback(() => {
        if (!xAxis || !yAxis || filteredData.length === 0) {
            return null;
        }
        const grouped = {};
        filteredData.forEach((row) => {
            const x = row[xAxis];
            const y = parseFloat(row[yAxis]);
            if (x !== undefined && x !== null && !isNaN(y)) {
                if (!grouped[x]) grouped[x] = 0;
                grouped[x] += y;
            }
        });
        const labels = Object.keys(grouped);
        const data = Object.values(grouped);
        return {
            labels: labels,
            datasets: [
                {
                    label: `${yAxis} by ${xAxis}`,
                    data: data,
                    // Dynamic background color for pie charts, static for others
                    backgroundColor: chartType === 'pie' ? labels.map((_, i) => `hsl(${(i * 50) % 360}, 70%, 60%)`) : chartColor,
                    borderColor: darkMode ? "#333" : "#fff",
                    borderWidth: 1,
                    hoverBackgroundColor: chartType === 'pie' ? labels.map((_, i) => `hsl(${(i * 50) % 360}, 85%, 70%)`) : String(chartColor) + 'AA',
                    pointRadius: chartType === 'line' ? pointRadius : 0, // Apply point radius only for line charts
                    pointHoverRadius: chartType === 'line' ? pointRadius + 2 : 0,
                    tension: chartType === 'line' ? lineTension : 0, // Apply tension only for line charts
                },
            ],
        };
    }, [xAxis, yAxis, filteredData, chartType, chartColor, darkMode, lineTension, pointRadius]);

    // Helper function to apply Top N filtering to chart data.
    // 💡 Adjust how Top N is calculated or applied if your data structure changes.
    const getTopNChartData = (data, topN) => {
        const N = parseInt(topN);
        if (!data || isNaN(N) || N <= 0) return data; // Return original data if N is invalid
        return {
            ...data,
            labels: data.labels.slice(0, N),
            datasets: data.datasets.map(dataset => ({
                ...dataset,
                data: dataset.data.slice(0, N)
            }))
        };
    };

    // Derived chart data and Top N filtered chart data
    const chartData = generateChartData();
    const topNChartData = getTopNChartData(chartData, topN);

    // Chart.js options configuration.
    // 💡 Customize chart legends, titles, tooltips, scales, and element styles here.
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: enableAnimation ? { duration: 1200, easing: "easeInOutQuart" } : false,
        interaction: {
            mode: "nearest",
            axis: "xy",
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: darkMode ? "#ddd" : "#222",
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: { size: 14, weight: "600", family: "Inter" },
                },
            },
            title: {
                display: !!chartTitle, // Only display if chartTitle is not empty
                text: chartTitle,
                color: darkMode ? "#f5f5f5" : "#111",
                font: { size: 22, weight: "bold" },
            },
            subtitle: {
                display: !!chartSubtitle, // Only display if chartSubtitle is not empty
                text: chartSubtitle,
                color: darkMode ? "#aaa" : "#444",
                font: { size: 16, style: "italic" },
            },
            tooltip: {
                backgroundColor: darkMode ? "#1f1f1f" : "#fff",
                borderColor: "#ccc",
                borderWidth: 1,
                titleColor: darkMode ? "#fff" : "#000",
                bodyColor: darkMode ? "#ddd" : "#333",
                usePointStyle: true,
                padding: 12,
            },
        },
        scales: chartType === "pie" ? {} : { // No scales for pie charts
            x: {
                grid: { color: darkMode ? "#444" : "#ddd", borderDash: [6, 4] },
                ticks: { color: darkMode ? "#ccc" : "#333", font: { size: 13 } },
                title: {
                    display: true, text: xAxis || "X-Axis",
                    color: darkMode ? "#aaa" : "#444", font: { size: 14, weight: "600" },
                },
            },
            y: {
                grid: { color: darkMode ? "#444" : "#ddd", borderDash: [6, 4] },
                ticks: { color: darkMode ? "#ccc" : "#333", font: { size: 13 } },
                title: {
                    display: true, text: yAxis || "Y-Axis",
                    color: darkMode ? "#aaa" : "#444", font: { size: 14, weight: "600" },
                },
            },
        },
        elements: {
            line: {
                tension: lineTension, borderWidth: 3,
                borderColor: chartColor, backgroundColor: chartColor,
            },
            point: {
                radius: pointRadius, backgroundColor: chartColor,
                hoverRadius: 6, hoverBorderColor: "#fff",
            },
            bar: {
                backgroundColor: chartColor, borderRadius: 6, borderSkipped: false,
            },
        },
    };

    // --- Export Functions ---
    // Functions for exporting data or charts in various formats.
    // 💡 Extend these functions for new export types or different export content.

    // Exports the raw Excel data table as a PDF using jspdf-autotable.
    const handleExportPDF = () => {
        const doc = new jsPDF("landscape"); // 'landscape' for wider tables
        const tableColumn = columns;
        const tableRows = sortedData.map((row) => columns.map((col) => row[col]?.toString() || "")
        );
        doc.text("Excel Raw Data", 14, 15);
        autoTable(doc, { // Using jspdf-autotable plugin
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak", },
            headStyles: { fillColor: [255, 204, 0], textColor: 20, fontStyle: "bold", },
            margin: { top: 20 },
            theme: "striped",
        });
        doc.save("ExcelDataTable.pdf");
    };

    // Exports all Excel data as a CSV file.
    const exportAsCSV = () => {
        if (excelData.length === 0) {
            alert("No data to export.");
            return;
        }
        const csv = [columns.join(",")]; // Header row
        excelData.forEach((row) => {
            // Escape quotes and handle commas in data cells
            csv.push(columns.map(col => `"${row[col]?.toString().replace(/"/g, '""') || ''}"`).join(","));
        });
        const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename.replace(/\.xlsx$/, '') || 'exported_data'}.csv`;
        link.click();
        setExportHistory([...exportHistory, { type: "CSV", time: new Date().toISOString(), filename: link.download }]);
        URL.revokeObjectURL(url); // Clean up
    };

    // Exports the rendered chart as a PDF using html2canvas.
    const exportAsPDF = () => {
        if (!chartAreaRef.current || !chartData) {
            alert("Chart not rendered or no data for PDF export.");
            return;
        }
        html2canvas(chartAreaRef.current, { useCORS: true, backgroundColor: darkMode ? '#1f2937' : '#fff' }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft >= 0) { // Handle multi-page charts
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            if (annotationText) { // Add annotation if present
                pdf.setFontSize(10);
                pdf.setTextColor(darkMode ? "#666" : "#333");
                pdf.text(annotationText, 10, pdf.internal.pageSize.height - 20);
            }
            const exportFileName = `${filename.replace(/\.xlsx$/, '') || 'chart'}.pdf`;
            pdf.save(exportFileName);
            setExportHistory([...exportHistory, { type: "PDF", time: new Date().toISOString(), filename: exportFileName }]);
        });
    };

    // Exports the rendered chart as a PNG image using html2canvas.
    const exportAsPNG = () => {
        if (!chartAreaRef.current || !chartData) {
            alert("Chart not rendered or no data for PNG export.");
            return;
        }
        html2canvas(chartAreaRef.current, { useCORS: true, backgroundColor: darkMode ? '#1f2937' : '#fff' }).then((canvas) => {
            const link = document.createElement("a");
            link.download = `${filename.replace(/\.xlsx$/, '') || 'chart'}.png`;
            link.href = canvas.toDataURL();
            link.click();
            setExportHistory([...exportHistory, { type: "PNG", time: new Date().toISOString(), filename: link.download }]);
        });
    };

    // --- Dashboard Actions ---
    // Functions that perform major actions on the dashboard state.
    // 💡 Add new reset conditions or complex multi-state actions here.

    // Resets all dashboard states to their initial values.
    const resetDashboard = () => {
        const confirmReset = window.confirm("Are you sure you want to reset the entire dashboard? All unsaved data and settings will be lost.");
        if (confirmReset) {
            setExcelData([]);
            setColumns([]);
            setXAxis("");
            setYAxis("");
            setChartType("bar");
            setFilename("SmartReport");
            setSearchTerm("");
            setChartTitle("Chart Title");
            setChartSubtitle("Chart Subtitle");
            setEnableAnimation(true);
            setSheetNames([]);
            setSelectedSheet("");
            setSortConfig({ key: null, direction: "asc" });
            setMinValue('');
            setMaxValue('');
            setChartColor('#FF6384');
            setCompareX1("");
            setCompareX2("");
            setExportHistory([]);
            setAutoRefresh(false);
            setVoiceResult("");
            setShareEmail("");
            setRecommendedChart("No recommendation yet.");
            setAnnotationText("");
            setDensity("comfortable");
            setLineTension(0.4);
            setPointRadius(3);
            setWhatIfScenario("");
            setWhatIfValue(0);
            setDateFilterStart("");
            setDateFilterEnd("");
            if (fileInputRef.current) {
                fileInputRef.current.value = null; // Clear file input value
            }
            localStorage.removeItem("recentFiles");
            localStorage.removeItem("savedDashboardTemplates");
            // Note: `currentUser` is NOT removed here to keep user logged in on reset.
            alert("Dashboard has been reset.");
        }
    };

    // --- Authentication Functions ---
    // Functions related to user login and logout.
    // 💡 Integrate with a backend authentication service here.

    // Handles user login logic.
    const handleLogin = () => {
        if (loginName.trim()) {
            // Simple mock login based on "pro" keyword in name
            const newUser = { name: loginName.trim(), plan: loginName.toLowerCase().includes("pro") ? "pro" : "free" };
            setUser(newUser);
            localStorage.setItem("currentUser", JSON.stringify(newUser)); // Persist user
            setShowLogin(false);
        } else {
            alert("Please enter a name to login.");
        }
    };

    // Handles user logout logic, clearing user session and most dashboard data.
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            setUser(null);
            localStorage.removeItem("currentUser"); // Clear user from local storage
            // Reset core dashboard data to simulate a fresh start after logout
            setExcelData([]);
            setColumns([]);
            setXAxis("");
            setYAxis("");
            setChartType("bar");
            setFilename("SmartReport");
            setSearchTerm("");
            setChartTitle("Chart Title");
            setChartSubtitle("Chart Subtitle");
            setEnableAnimation(true);
            setSheetNames([]);
            setSelectedSheet("");
            setSortConfig({ key: null, direction: "asc" });
            setMinValue('');
            setMaxValue('');
            setChartColor('#FF6384');
            setCompareX1("");
            setCompareX2("");
            setExportHistory([]);
            setAutoRefresh(false);
            setVoiceResult("");
            setShareEmail("");
            setRecommendedChart("No recommendation yet.");
            setAnnotationText("");
            setDensity("comfortable");
            setLineTension(0.4);
            setPointRadius(3);
            setWhatIfScenario("");
            setWhatIfValue(0);
            setDateFilterStart("");
            setDateFilterEnd("");
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            }
            localStorage.removeItem("recentFiles"); // Clear recent files on logout
            localStorage.removeItem("savedDashboardTemplates"); // Clear templates on logout
            setShowLogin(true); // Show login modal again
        }
    };

    // --- Settings Management Functions ---
    // Functions for saving and loading dashboard configurations.
    // 💡 Add new settings to save/load here if you introduce more customization options.

    // Saves current dashboard settings as a JSON file.
    const saveSettingsAsJSON = () => {
        const settings = {
            xAxis, yAxis, chartType, chartTitle, chartSubtitle, enableAnimation, darkMode, chartColor, lineTension, pointRadius, minValue, maxValue, annotationText, density,
        };
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename.replace(/\.xlsx$/, '') || 'chart'}_settings.json`;
        link.click();
    };

    // Saves current chart settings as a reusable template in local storage.
    const handleSaveTemplate = () => {
        if (excelData.length === 0) {
            alert("Please upload data before saving a template.");
            return;
        }
        const templateName = prompt("Enter a name for your dashboard template:");
        if (templateName) {
            const newTemplate = {
                name: templateName,
                settings: { // Define what settings are part of the template
                    xAxis, yAxis, chartType, chartTitle, chartSubtitle, enableAnimation, darkMode, chartColor, lineTension, pointRadius, minValue, maxValue, annotationText, density
                }
            };
            const updatedTemplates = [...savedTemplates, newTemplate];
            setSavedTemplates(updatedTemplates);
            localStorage.setItem("savedDashboardTemplates", JSON.stringify(updatedTemplates));
            alert(`Template "${templateName}" saved!`);
        }
    };

    // Loads a saved template and applies its settings to the dashboard.
    const handleLoadTemplate = (templateName) => {
        const templateToLoad = savedTemplates.find(template => template.name === templateName);
        if (templateToLoad) {
            const settings = templateToLoad.settings;
            // Apply each setting from the loaded template, with fallbacks
            setXAxis(settings.xAxis || "");
            setYAxis(settings.yAxis || "");
            setChartType(settings.chartType || "bar");
            setChartTitle(settings.chartTitle || "Chart Title");
            setChartSubtitle(settings.chartSubtitle || "Chart Subtitle");
            setEnableAnimation(settings.enableAnimation !== undefined ? settings.enableAnimation : true);
            setDarkMode(settings.darkMode !== undefined ? settings.darkMode : true);
            setChartColor(settings.chartColor || '#FF6384');
            setMinValue(settings.minValue || '');
            setMaxValue(settings.maxValue || '');
            setAnnotationText(settings.annotationText || "");
            setDensity(settings.density || "comfortable");
            setLineTension(settings.lineTension !== undefined ? settings.lineTension : 0.4);
            setPointRadius(settings.pointRadius !== undefined ? settings.pointRadius : 3);
            alert(`Template "${templateName}" loaded!`);
        }
    };

    // --- Sharing & Plugins Functions ---
    // Functions for sharing content and interacting with external services (mocked here).
    // 💡 Replace mock implementations with actual API calls for sharing.

    // Simulates sharing the chart image via email.
    const handleShareEmail = () => {
        if (!shareEmail) {
            alert("Please enter an email address.");
            return;
        }
        if (!chartAreaRef.current || !chartData) {
            alert("No chart to share. Please generate a chart first.");
            return;
        }
        html2canvas(chartAreaRef.current, { useCORS: true, backgroundColor: darkMode ? '#1f2937' : '#fff' }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            // In a real app, you'd send `imgData` to a backend service that then emails it
            console.log(`Simulating sharing chart with ${shareEmail}. Image data would be sent.`);
            alert(`Chart image sent to ${shareEmail}! (Mock Functionality)`);
            setShareEmail("");
        });
    };

    // --- Utility Functions/Classes ---
    // Helper functions for common tasks or deriving values.
    // 💡 Add new utility functions for calculations or dynamic styling.

    // Returns CSS class for table density.
    const getTableDensityClass = () => {
        return density === "compact" ? "text-xs" : "text-sm";
    };

    // Returns CSS class for table padding based on density.
    const getTablePaddingClass = () => {
        return density === "compact" ? "px-2 py-0.5" : "px-3 py-1";
    };

    // Calculates the most frequent category for the X-axis.
    // Uses `useCallback` to prevent unnecessary re-calculations.
    const calculateTopCategory = useCallback(() => {
        if (!xAxis || excelData.length === 0) return 'N/A';
        const categoryCounts = excelData.reduce((acc, row) => {
            const key = row[xAxis];
            if (key !== undefined && key !== null && key !== '') {
                acc[key] = (acc[key] || 0) + 1;
            }
            return acc;
        }, {});
        // Find the key with the highest count
        return Object.keys(categoryCounts).length > 0 ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b) : 'N/A';
    }, [xAxis, excelData]);
    const topCategory = calculateTopCategory(); // Derived value

    // Calculates the maximum numerical value for the Y-axis.
    // Uses `useCallback` to prevent unnecessary re-calculations.
    const calculateDerivedMaxValue = useCallback(() => {
        if (!yAxis || excelData.length === 0) return 'N/A';
        const values = excelData.map(row => parseFloat(row[yAxis])).filter(val => !isNaN(val));
        return values.length > 0 ? Math.max(...values) : 'N/A';
    }, [yAxis, excelData]);
    const derivedMaxValue = calculateDerivedMaxValue(); // Derived value

    // Generates a natural language summary/narrative of the current chart data.
    // Uses `useCallback` to prevent unnecessary re-generation.
    // 💡 Extend this for more complex NLG or integrate with an NLG API.
    const generateDataNarrative = useCallback(() => {
        if (!xAxis || !yAxis || filteredData.length === 0) {
            return "Upload data and select X/Y axes to get insights.";
        }
        const grouped = {};
        filteredData.forEach((row) => {
            const x = row[xAxis];
            const y = parseFloat(row[yAxis]);
            if (x !== undefined && x !== null && x !== '' && !isNaN(y)) {
                if (!grouped[x]) grouped[x] = 0;
                grouped[x] += y;
            }
        });
        const sortedEntries = Object.entries(grouped).sort(([, a], [, b]) => b - a);
        const total = Object.values(grouped).reduce((sum, val) => sum + val, 0);

        if (sortedEntries.length === 0) return "No data to summarize after filtering.";

        const topEntry = sortedEntries[0];
        const bottomEntry = sortedEntries[sortedEntries.length - 1];

        let narrative = `The data for **${filename.replace(/\.xlsx$/, '') || 'the uploaded file'}** shows **${yAxis}** aggregated by **${xAxis}**. `;
        narrative += `The **total ${yAxis}** across all categories is **${total.toLocaleString()}**. `;
        if (topEntry) {
            narrative += `**${topEntry[0]}** leads with ${yAxis} of **${topEntry[1].toLocaleString()}**. `;
        }
        if (bottomEntry && sortedEntries.length > 1) {
            narrative += `Conversely, **${bottomEntry[0]}** has the lowest ${yAxis} at **${bottomEntry[1].toLocaleString()}**. `;
        }
        narrative += `Currently viewing **${filteredData.length} of ${excelData.length} records** after applying filters.`;
        return narrative;
    }, [xAxis, yAxis, filteredData, excelData.length, filename]);
    const dataNarrative = generateDataNarrative(); // Derived value

    // Return all states, refs, derived data, and functions from the hook
    // This is what your component will destructure and use.
    // 💡 If you add new states or functions, ensure they are returned here.
    return {
        // States
        excelData, setExcelData,
        columns, setColumns,
        xAxis, setXAxis,
        yAxis, setYAxis,
        chartType, setChartType,
        chartTitle, setChartTitle,
        chartSubtitle, setChartSubtitle,
        filename, setFilename,
        darkMode, setDarkMode,
        searchTerm, setSearchTerm,
        enableAnimation, setEnableAnimation,
        sheetNames, setSheetNames,
        selectedSheet, setSelectedSheet,
        sortConfig, setSortConfig,
        recentFiles, setRecentFiles,
        loading, setLoading,
        activeTab, setActiveTab,
        isSidebarOpen, setIsSidebarOpen,
        minValue, setMinValue,
        maxValue, setMaxValue,
        chartColor, setChartColor,
        annotationText, setAnnotationText,
        lineTension, setLineTension,
        pointRadius, setPointRadius,
        user, setUser,
        showLogin, setShowLogin,
        loginName, setLoginName,
        compareX1, setCompareX1,
        compareX2, setCompareX2,
        exportHistory, setExportHistory,
        autoRefresh, setAutoRefresh,
        voiceResult, setVoiceResult,
        savedTemplates, setSavedTemplates,
        shareEmail, setShareEmail,
        recommendedChart, setRecommendedChart,
        density, setDensity,
        whatIfScenario, setWhatIfScenario,
        whatIfValue, setWhatIfValue,
        dateFilterStart, setDateFilterStart,
        dateFilterEnd, setDateFilterEnd,
        topN, setTopN,
        customTopN, setCustomTopN,

        // Refs
        mountRef,
        chartAreaRef,
        fileInputRef,
        chartRef,

        // Derived Data / Callbacks (these are typically read-only values in your component)
        filteredData,
        sortedData,
        chartData, // The raw chart data before Top N applied
        topNChartData, // Chart data after Top N applied
        chartOptions,
        topCategory,
        derivedMaxValue,
        dataNarrative,

        // Functions (these are actions your component can trigger)
        handleExportPDF, // For exporting raw excel data to PDF
        handleFileUpload,
        handleSheetChange,
        exportAsCSV,
        exportAsPDF, // For exporting the chart to PDF
        exportAsPNG,
        resetDashboard,
        handleLogin,
        handleLogout,
        saveSettingsAsJSON,
        handleSaveTemplate,
        handleLoadTemplate,
        handleShareEmail,
        getTableDensityClass,
        getTablePaddingClass,
    };
};

export default useDashboardLogic;