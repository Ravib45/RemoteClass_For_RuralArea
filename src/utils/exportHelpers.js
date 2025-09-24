// utils/exportHelpers.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

/**
 * 📄 Exports the given Excel table data as a PDF.
 * 
 * @param {Array} columns - The column headers of the table.
 * @param {Array} data - The table data (array of objects).
 * @param {String} filename - The desired filename for the PDF.
 */
export function exportTableToPDF(columns, data, filename = "ExcelDataTable") {
    const doc = new jsPDF("landscape");

    const tableColumn = columns;
    const tableRows = data.map((row) =>
        columns.map((col) => row[col]?.toString() || "")
    );

    doc.text("Excel Raw Data", 14, 15);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
            fontSize: 8,
            cellPadding: 3,
            overflow: "linebreak",
        },
        headStyles: {
            fillColor: [255, 204, 0],
            textColor: 20,
            fontStyle: "bold",
        },
        margin: { top: 20 },
        theme: "striped",
    });

    doc.save(`${filename}.pdf`);
}


/**
 * 📸 Exports the provided chart DOM element as a PNG image.
 * 
 * @param {HTMLElement} chartRef - The chart DOM element.
 * @param {String} filename - Desired PNG file name.
 * @param {Boolean} darkMode - To determine background color.
 * @param {Function} updateExportHistory - Callback to update export history log.
 */
export function exportChartAsPNG(chartRef, filename, darkMode, updateExportHistory) {
    if (!chartRef) {
        alert("Chart not rendered.");
        return;
    }

    html2canvas(chartRef, {
        useCORS: true,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff'
    }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL();
        link.click();

        if (typeof updateExportHistory === "function") {
            updateExportHistory({
                type: "PNG",
                time: new Date().toISOString(),
                filename: link.download
            });
        }
    });
}


/**
 * 🧾 Exports the chart DOM as a multi-page PDF (if needed).
 * 
 * @param {HTMLElement} chartRef - The chart DOM element to export.
 * @param {String} filename - Desired PDF name.
 * @param {String} annotationText - Optional text to add at bottom.
 * @param {Boolean} darkMode - Dark mode status for background.
 * @param {Function} updateExportHistory - Callback to update export logs.
 */
export function exportChartAsPDF(chartRef, filename, annotationText, darkMode, updateExportHistory) {
    if (!chartRef) {
        alert("Chart not rendered.");
        return;
    }

    html2canvas(chartRef, {
        useCORS: true,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff'
    }).then((canvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        if (annotationText) {
            pdf.setFontSize(10);
            pdf.setTextColor(darkMode ? "#666" : "#333");
            pdf.text(annotationText, 10, pdf.internal.pageSize.height - 20);
        }

        pdf.save(`${filename}.pdf`);

        if (typeof updateExportHistory === "function") {
            updateExportHistory({
                type: "PDF",
                time: new Date().toISOString(),
                filename: `${filename}.pdf`
            });
        }
    });
}


/**
 * 📊 Exports all table data as a CSV file.
 * 
 * @param {Array} data - All rows of the table.
 * @param {Array} columns - Header columns.
 * @param {String} filename - Desired filename.
 * @param {Function} updateExportHistory - Callback to update logs.
 */
export function exportAsCSV(data, columns, filename, updateExportHistory) {
    if (data.length === 0) {
        alert("No data to export.");
        return;
    }

    const csv = [columns.join(",")];
    data.forEach((row) => {
        csv.push(columns.map(col =>
            `"${row[col]?.toString().replace(/"/g, '""') || ''}"`
        ).join(","));
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();

    URL.revokeObjectURL(url);

    if (typeof updateExportHistory === "function") {
        updateExportHistory({
            type: "CSV",
            time: new Date().toISOString(),
            filename: `${filename}.csv`
        });
    }
}
