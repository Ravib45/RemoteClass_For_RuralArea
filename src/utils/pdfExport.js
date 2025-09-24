import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

const handleExportPDF = () => {
    const doc = new jsPDF("landscape");
    const tableColumn = columns;
    const tableRows = sortedData.map((row) =>
        columns.map((col) => row[col]?.toString() || "")
    );

    doc.text("Excel Raw Data", 14, 15);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 8 },
        margin: { top: 20 },
        theme: "striped",
    });

    doc.save("ExcelDataTable.pdf");

    Swal.fire({
        icon: "success",
        title: "PDF Exported",
        text: "Your data table has been downloaded!",
        confirmButtonColor: "#facc15",
    });
};
