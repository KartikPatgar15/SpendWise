// src/utils/exportPdf.js
// PDF export using jsPDF + jspdf-autotable.
// Install: npm install jspdf jspdf-autotable

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatRupees, totalAmount, categorySummary } from "./expenseHelpers";
import { totalAmount as calcTotal, categorySummary as calcCategories } from "./analytics";

/**
 * Export an array of expenses to a formatted PDF.
 * @param {Array} expenses
 * @param {string} title - Report title (e.g. "Monthly Report – June 2025")
 * @param {string} filename - Output filename (e.g. "june-2025.pdf")
 */
export function exportToPDF(expenses, title = "Expense Report", filename = "expenses.pdf") {
  const doc = new jsPDF();

  // ── Header ──────────────────────────────────────────────
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SpendWise", 14, 18);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(title, 14, 26);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, 32);

  // ── Summary Stats ────────────────────────────────────────
  const total = calcTotal(expenses);
  const categories = calcCategories(expenses);

  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, 44);

  doc.setFont("helvetica", "normal");
  doc.text(`Total Expenses: ${formatRupees(total)}`, 14, 51);
  doc.text(`Total Transactions: ${expenses.length}`, 14, 57);

  // ── Category Summary Table ────────────────────────────────
  const categoryRows = Object.entries(categories).map(([cat, amt]) => [
    cat,
    formatRupees(amt),
    `${((amt / total) * 100).toFixed(1)}%`,
  ]);

  autoTable(doc, {
    startY: 63,
    head: [["Category", "Amount", "% of Total"]],
    body: categoryRows,
    headStyles: { fillColor: [37, 99, 235], fontStyle: "bold" },
    styles: { fontSize: 10 },
    margin: { left: 14 },
    tableWidth: 100,
  });

  // ── Expense Detail Table ─────────────────────────────────
  const detailRows = expenses.map((e) => [
    formatDate(e.date),
    e.type,
    e.description,
    formatRupees(e.amount),
  ]);

  const prevY = doc.lastAutoTable.finalY + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Expense Details", 14, prevY);

  autoTable(doc, {
    startY: prevY + 4,
    head: [["Date", "Category", "Description", "Amount"]],
    body: detailRows,
    headStyles: { fillColor: [37, 99, 235], fontStyle: "bold" },
    styles: { fontSize: 9 },
    columnStyles: {
      3: { halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer ───────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `SpendWise — Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: "center" }
    );
  }

  doc.save(filename);
}
