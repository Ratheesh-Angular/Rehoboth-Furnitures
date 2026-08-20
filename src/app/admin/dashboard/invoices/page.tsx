"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  Printer,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Invoice,
  deleteInvoice,
  getInvoices,
  markInvoice,
} from "@/lib/api/invoice.api";
import { numberToWords } from "@/lib/utils/number-to-words";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const monthOptions = [
  { value: "all", label: "All months" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const COMPANY_MAP = {
  rehoboth: {
    label: "Rehoboth",
    name: "REHOBOTH TIMBER AND FURNITURES",
    addressLines: [
      "121/5, St. Mary's Street, Maravankudiyiruppu, Nagercoil - 629 002. Kanyakumari District, Tamil Nadu",
    ],
    gstin: "33AMXPA0210F1ZO",
    state: "Tamil Nadu",
    motto: "Karthar Nallavar",
    bankName: "Rehoboth Timber and Furniture",
    accountNo: "005507777777777",
    ifsc: "TMBL 0000005",
    branch: "Nagercoil",
    signName: "Rehoboth Timber and Furniture",
  },
  kirubai: {
    label: "Kirubai",
    name: "KIRUBAI TIMBERS AND FURNITURE",
    addressLines: [
      "3/127D, Ramanputhoor Salai, Keezhakattuvilai, Pallam P.O., Nagercoil, Kanyakumari District, Tamil Nadu - 629 601.",
    ],
    gstin: "33AMXPA0210F1ZO",
    state: "Tamil Nadu",
    motto: "Karthar Nallavar",
    bankName: "Kirubai Timbers and Furniture",
    accountNo: "005531777777777",
    ifsc: "TMBL 0000005",
    branch: "Nagercoil",
    signName: "Kirubai Timber and Furniture",
  },
} as const;

function normalizeDate(dateString: string) {
  if (!dateString) return "";
  const parsed = new Date(dateString);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  return dateString;
}

function formatDate(dateString: string) {
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return dateString || "-";
  return parsed.toLocaleDateString("en-IN");
}

/** Safe filename for PDF download (Windows / cross-browser). */
function sanitizePdfFilename(base: string) {
  const cleaned = base.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").trim();
  return cleaned.length > 0 ? cleaned : "invoice";
}

function getInvoiceDocumentHtml(invoice: Invoice) {
  const companyKey = invoice.company === "kirubai" ? "kirubai" : "rehoboth";
  const company = COMPANY_MAP[companyKey];

  const itemRows = invoice.items
    .map(
      (item, index) => `
      <tr>
        <td class="px-3 py-2 text-center">${index + 1}</td>
        <td class="px-3 py-2">${item.particulars || ""}</td>
        <td class="px-3 py-2">${item.hsnCode || ""}</td>
        <td class="px-3 py-2">${item.uom || ""}</td>
        <td class="px-3 py-2 text-right">${item.qty || ""}</td>
        <td class="px-3 py-2 text-right">${item.rate || ""}</td>
        <td class="px-3 py-2 text-right" style="font-variant-numeric:tabular-nums">
          ${Number(item.total || 0).toFixed(2)}
        </td>
      </tr>`,
    )
    .join("");

  const taxableValue = Number(invoice.taxableValue || 0);
  const cgst = Number(invoice.cgst || 0);
  const sgst = Number(invoice.sgst || 0);
  const igst = Number(invoice.igst || 0);
  const totalValue = Number(invoice.totalValue || 0);
  const totalInWords = numberToWords(totalValue);
  const invoiceDate = invoice.date || normalizeDate(invoice.createdAt);

  const taxRows = invoice.useIgst
    ? `<div style="display:flex;justify-content:space-between;margin-bottom:4px">
         <span>IGST @ 18%:</span><span>${igst.toFixed(2)}</span>
       </div>`
    : `<div style="display:flex;justify-content:space-between;margin-bottom:4px">
         <span>CGST @ 9%:</span><span>${cgst.toFixed(2)}</span>
       </div>
       <div style="display:flex;justify-content:space-between;margin-bottom:4px">
         <span>SGST @ 9%:</span><span>${sgst.toFixed(2)}</span>
       </div>`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Invoice ${invoice.invoiceNo}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #fff; color: #000; font-size: 13px; }
    #invoice-print {
      width: 210mm; min-height: 297mm; padding: 10mm 10mm;
      display: flex; flex-direction: column; background: #fff;
    }
  </style>
</head>
<body>
<div id="invoice-print">

  <!-- TAX INVOICE / ORIGINAL -->
  <div style="display:flex;justify-content:space-between;margin-bottom:10px">
    <span style="font-weight:700;font-size:13px">TAX INVOICE</span>
    <span style="font-weight:700;font-size:13px">ORIGINAL</span>
  </div>

  <!-- Company Header -->
  <div style="margin-bottom:10px;padding-bottom:8px;border-bottom:1.5px solid #000">
    <div style="font-size:10px;margin-bottom:3px">&#10013; ${company.motto}</div>
    <div style="font-size:22px;font-weight:700;letter-spacing:-0.3px;margin-bottom:4px">${company.name}</div>
    <div style="font-size:13px;margin-bottom:3px">GSTIN/UIN: ${company.gstin}</div>
    <div style="font-size:13px;line-height:1.4">${company.addressLines.join(", ")}</div>
  </div>

  <!-- Meta Grid (2-column) -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px 24px;margin-bottom:10px;font-size:13px">

    <div style="display:flex;gap:6px;align-items:baseline">
      <span style="width:88px;flex-shrink:0">GSTIN No:</span>
      <span style="flex:1;border-bottom:1px solid #000;min-height:18px;padding-bottom:1px">${invoice.customerGstin || ""}</span>
    </div>
    <div style="display:flex;gap:6px;align-items:baseline">
      <span style="width:88px;flex-shrink:0">Invoice No:</span>
      <span style="flex:1;border-bottom:1px solid #000;min-height:18px;padding-bottom:1px">${invoice.invoiceNo || ""}</span>
    </div>

    <div style="display:flex;gap:6px;align-items:baseline">
      <span style="width:88px;flex-shrink:0">State Code:</span>
      <span style="flex:1;border-bottom:1px solid #000;min-height:18px;padding-bottom:1px">${invoice.customerStateCode || ""}</span>
    </div>
    <div style="display:flex;gap:6px;align-items:baseline">
      <span style="width:88px;flex-shrink:0">State:</span>
      <span style="flex:1;border-bottom:1px solid #000;min-height:18px;padding-bottom:1px">${invoice.customerState || ""}</span>
    </div>

    <div style="display:flex;gap:6px;align-items:baseline">
      <span style="width:88px;flex-shrink:0">Buyer Name:</span>
      <span style="flex:1;border-bottom:1px solid #000;min-height:18px;padding-bottom:1px">${invoice.buyerName || ""}</span>
    </div>
    <div style="display:flex;gap:6px;align-items:baseline">
      <span style="width:88px;flex-shrink:0">Vehicle No.:</span>
      <span style="flex:1;border-bottom:1px solid #000;min-height:18px;padding-bottom:1px">${invoice.vehicleNo || ""}</span>
    </div>

    <div style="display:flex;gap:6px;align-items:baseline">
      <span style="width:88px;flex-shrink:0">Date:</span>
      <span style="flex:1;border-bottom:1px solid #000;min-height:18px;padding-bottom:1px">${invoiceDate || ""}</span>
    </div>
    <div></div>

    <!-- Customer Address - full width -->
    <div style="grid-column:1 / span 2;margin-top:4px">
      <div style="font-size:11px;font-weight:600;margin-bottom:3px">Customer Address:</div>
      <div style="font-size:13px;border-bottom:1px solid #000;min-height:36px;white-space:pre-wrap;padding-bottom:2px">${invoice.buyerAddress || "—"}</div>
    </div>
  </div>

  <!-- Items Table -->
  <div style="border:1px solid #000;margin-bottom:8px;min-height:108mm;position:relative;overflow:hidden">
    <!-- Vertical column dividers -->
    <div style="position:absolute;top:0;bottom:0;left:5%;border-left:1px solid #000"></div>
    <div style="position:absolute;top:0;bottom:0;left:37%;border-left:1px solid #000"></div>
    <div style="position:absolute;top:0;bottom:0;left:49%;border-left:1px solid #000"></div>
    <div style="position:absolute;top:0;bottom:0;left:57%;border-left:1px solid #000"></div>
    <div style="position:absolute;top:0;bottom:0;left:67%;border-left:1px solid #000"></div>
    <div style="position:absolute;top:0;bottom:0;left:80%;border-left:1px solid #000"></div>
    <table style="width:100%;border-collapse:collapse;font-size:13px;position:relative;z-index:10">
      <colgroup>
        <col style="width:5%"/>
        <col style="width:32%"/>
        <col style="width:12%"/>
        <col style="width:8%"/>
        <col style="width:10%"/>
        <col style="width:13%"/>
        <col style="width:20%"/>
      </colgroup>
      <thead>
        <tr style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px">
          <th style="border-bottom:1px solid #000;padding:7px 10px;font-weight:700;text-align:center">SL. NO.</th>
          <th style="border-bottom:1px solid #000;padding:7px 10px;font-weight:700;text-align:left">PARTICULARS</th>
          <th style="border-bottom:1px solid #000;padding:7px 10px;font-weight:700;text-align:left">HSN CODE</th>
          <th style="border-bottom:1px solid #000;padding:7px 10px;font-weight:700;text-align:left">UOM</th>
          <th style="border-bottom:1px solid #000;padding:7px 10px;font-weight:700;text-align:right">QTY.</th>
          <th style="border-bottom:1px solid #000;padding:7px 10px;font-weight:700;text-align:right">RATE</th>
          <th style="border-bottom:1px solid #000;padding:7px 10px;font-weight:700;text-align:right">TOTAL</th>
        </tr>
      </thead>
      <tbody style="vertical-align:top">
        ${itemRows || '<tr><td colspan="7" style="padding:8px 10px;text-align:center">No items</td></tr>'}
      </tbody>
    </table>
  </div>

  <!-- Total in Words (left) + Tax Summary (right) -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:16px;font-size:13px">
    <!-- Left: Words -->
    <div style="flex:1">
      <div style="font-weight:700;margin-bottom:3px">Total Value in Words:</div>
      <div>${totalInWords}</div>
    </div>
    <!-- Right: Summary box -->
    <div style="width:220px;flex-shrink:0">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span>TAXABLE VALUE:</span><span>${taxableValue.toFixed(2)}</span>
      </div>
      ${taxRows}
      <div style="display:flex;justify-content:space-between;font-weight:700;border-top:1.5px solid #000;padding-top:4px;margin-top:2px">
        <span>TOTAL VALUE:</span><span>${totalValue.toFixed(2)}</span>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div style="display:flex;justify-content:space-between;align-items:flex-end;padding-top:8px;margin-top:auto;font-size:13px">
    <div>
      <div style="font-weight:700;margin-bottom:2px">${company.bankName}</div>
      <div>A/C. No.: ${company.accountNo}</div>
      <div>IFSC: ${company.ifsc}</div>
      <div>Branch: ${company.branch}</div>
    </div>
    <div style="text-align:center">
      <div style="margin-bottom:32px">For ${company.signName}</div>
      <div style="width:160px;border-bottom:1px solid #000;margin:0 auto 4px"></div>
      <div style="font-size:11px">Authorised Signatory</div>
    </div>
  </div>

</div>
</body>
</html>`;
}

function printInvoice(invoice: Invoice) {
  const printWindow = window.open("", "_blank", "width=900,height=1200");
  if (!printWindow) {
    toast.error("Unable to open print preview. Please allow pop-ups.");
    return;
  }

  printWindow.document.write(getInvoiceDocumentHtml(invoice));

  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
}

/**
 * html2canvas cannot parse modern CSS color functions (lab, oklch, lch, oklab, color()).
 * This walks all stylesheets in the target document and replaces them with safe fallbacks
 * so html2canvas doesn't crash during its CSS parse phase.
 */

/** Reliable PDF without html2canvas (fallback if HTML snapshot fails). */
// ─────────────────────────────────────────────────────────────────────────────
// REPLACE the entire `downloadInvoicePdfWithJsPdf` function with this.
// Also:
//   1. Remove `downloadInvoicePdf` and `sanitizeStylesForHtml2Canvas` entirely.
//   2. Change the Download button onClick to: onClick={() => downloadInvoicePdfWithJsPdf(invoice)}
//      (it already does this — just confirm the html2pdf path is gone)
// ─────────────────────────────────────────────────────────────────────────────

// Replace the entire `downloadInvoicePdfWithJsPdf` function with this.
// Also remove `downloadInvoicePdf` and `sanitizeStylesForHtml2Canvas` — not needed.
// The Download button onClick should call: downloadInvoicePdfWithJsPdf(invoice)

function downloadInvoicePdfWithJsPdf(invoice: Invoice) {
  const companyKey = invoice.company === "kirubai" ? "kirubai" : "rehoboth";
  const company = COMPANY_MAP[companyKey];
  const invoiceDate = invoice.date || normalizeDate(invoice.createdAt);
  const filename = sanitizePdfFilename(
    `${invoice.buyerName || "buyer"}-${invoice.invoiceNo || "invoice"}`,
  );

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth(); // 210
  const pageH = doc.internal.pageSize.getHeight(); // 297
  const L = 14; // left margin
  const R = pageW - 14; // right margin
  const W = R - L; // content width ~182mm
  let y = 14;

  // ── 1. TAX INVOICE / ORIGINAL ──────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TAX INVOICE", L, y);
  doc.text("ORIGINAL", R, y, { align: "right" });
  y += 3;

  // Thin rule below header line
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.line(L, y, R, y);
  y += 5;

  // ── 2. MOTTO (small, with cross icon) ─────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  // Unicode cross ✝ U+271D — jsPDF falls back gracefully if glyph missing
  y += 5;

  // ── 3. COMPANY NAME (large bold) ──────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(company.name, L, y);
  y += 7;

  // ── 4. GSTIN line ─────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`GSTIN/UIN: ${company.gstin}`, L, y);
  y += 5;

  // ── 5. ADDRESS line ───────────────────────────────────────────────────────
  doc.setFontSize(8.5);
  const addrText = company.addressLines.join(", ");
  const addrSplit = doc.splitTextToSize(addrText, W);
  doc.text(addrSplit, L, y);
  y += addrSplit.length * 4.5;

  // Thin rule after company block
  doc.setLineWidth(0.25);
  doc.line(L, y + 1, R, y + 1);
  y += 8;

  // ── 6. META GRID (2 columns, underlined values) ───────────────────────────
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  // Column split: left col ends at midX, right col starts at midX
  const midX = L + W / 2;
  // Label width (fixed, matches screenshot proportions)
  const lblW = 22;

  /**
   * Draw one label + underlined value field.
   * x      = left edge of the field
   * fieldW = total width available for label + value
   */
  function drawField(
    label: string,
    value: string,
    x: number,
    fy: number,
    fieldW: number,
  ) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(label, x, fy);

    const valX = x + lblW;
    const lineEndX = x + fieldW - 2;
    const singleLine = doc.splitTextToSize(value, lineEndX - valX)[0] ?? "";
    doc.text(singleLine, valX, fy);

    // Underline the value cell
    doc.setLineWidth(0.2);
    doc.line(valX, fy + 1, lineEndX, fy + 1);
  }

  const halfW = W / 2 - 3; // width for each column's field

  // Row 1: GSTIN No | Invoice No
  drawField("GSTIN No:", invoice.customerGstin || "", L, y, halfW);
  drawField("Invoice No:", invoice.invoiceNo || "", midX + 2, y, halfW);
  y += 6;

  // Row 2: State Code | State
  drawField("State Code:", invoice.customerStateCode || "", L, y, halfW);
  drawField("State:", invoice.customerState || "", midX + 2, y, halfW);
  y += 6;

  // Row 3: Buyer Name | Vehicle No.
  drawField("Buyer Name:", invoice.buyerName || "", L, y, halfW);
  drawField("Vehicle No.:", invoice.vehicleNo || "", midX + 2, y, halfW);
  y += 6;

  // Row 4: Date (left only)
  drawField("Date:", invoiceDate || "", L, y, halfW);
  y += 8;

  // ── 7. CUSTOMER ADDRESS ───────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Customer Address:", L, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const custAddrLines = doc.splitTextToSize(invoice.buyerAddress || "—", W);
  doc.text(custAddrLines, L, y);
  y += custAddrLines.length * 4.5 + 4;

  // ── 8. ITEMS TABLE ────────────────────────────────────────────────────────
  const tableBody = (invoice.items || []).map((item, i) => [
    String(i + 1),
    item.particulars || "",
    item.hsnCode || "",
    item.uom || "",
    String(item.qty ?? ""),
    String(item.rate ?? ""),
    Number(item.total || 0).toFixed(2),
  ]);

  const tableStartY = y;

  autoTable(doc, {
    startY: tableStartY,
    head: [
      [
        { content: "SL.\nNO.", styles: { halign: "center" } },
        "PARTICULARS",
        "HSN CODE",
        "UOM",
        { content: "QTY.", styles: { halign: "right" } },
        { content: "RATE", styles: { halign: "right" } },
        { content: "TOTAL", styles: { halign: "right" } },
      ],
    ],
    body:
      tableBody.length > 0 ? tableBody : [["", "No items", "", "", "", "", ""]],
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { halign: "left", cellWidth: 52 },
      2: { halign: "left", cellWidth: 24 },
      3: { halign: "left", cellWidth: 14 },
      4: { halign: "right", cellWidth: 18 },
      5: { halign: "right", cellWidth: 26 },
      6: { halign: "right", cellWidth: "auto" },
    },
    styles: {
      fontSize: 8.5,
      cellPadding: { top: 2.5, bottom: 2.5, left: 2, right: 2 },
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.25,
      valign: "top",
      font: "helvetica",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 7.5,
      lineColor: [0, 0, 0],
      lineWidth: 0.25,
      valign: "middle",
    },
    bodyStyles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.25,
    },
    theme: "grid",
    margin: { left: L, right: pageW - R },
  });

  // Enforce minimum table body height ≈ 95 mm (matches the tall blank rows in screenshot)
  const rawFinalY =
    (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? tableStartY;
  const minTableBottom = tableStartY + 95;
  y = Math.max(rawFinalY, minTableBottom) + 6;

  // ── 9. TOTALS SECTION ─────────────────────────────────────────────────────
  // Layout: "Total Value in Words" label bold left, tax summary right-aligned block
  // No surrounding box — plain text, matching screenshot

  if (y > pageH - 60) {
    doc.addPage();
    y = 20;
  }

  // Right summary block — right-aligned labels + values
  // Positioned to match screenshot (right half, stacked rows)
  const sumLabelX = L + W * 0.55; // label starts ~55% across
  const sumValueX = R; // values right-aligned to margin

  const taxableValue = Number(invoice.taxableValue || 0);
  const cgst = Number(invoice.cgst || 0);
  const sgst = Number(invoice.sgst || 0);
  const igst = Number(invoice.igst || 0);
  const totalValue = Number(invoice.totalValue || 0);

  let sy = y;

  function sumRow(label: string, value: string, bold = false) {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.text(label, sumLabelX, sy);
    doc.text(value, sumValueX, sy, { align: "right" });
    sy += 5.5;
  }

  sumRow("TAXABLE VALUE:", taxableValue.toFixed(2));

  if (invoice.useIgst) {
    sumRow("IGST @ 18%:", igst.toFixed(2));
  } else {
    sumRow("CGST @ 9%:", cgst.toFixed(2));
    sumRow("SGST @ 9%:", sgst.toFixed(2));
  }

  // TOTAL VALUE row — bold, slightly larger
  doc.setLineWidth(0.1);
  // No rule above total in screenshot — just bold text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("TOTAL VALUE:", sumLabelX, sy);
  // Rupee symbol ₹ — use unicode, jsPDF core font falls back to "Rs." gracefully
  doc.text(`${totalValue.toFixed(2)}`, sumValueX, sy, { align: "right" });
  sy += 5.5;

  // Left — "Total Value in Words" (aligned to same starting y as summary block)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Total Value in Words:", L, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const wordLines = doc.splitTextToSize(
    numberToWords(totalValue),
    sumLabelX - L - 6,
  );
  doc.text(wordLines, L, y + 5);

  y = Math.max(sy, y + 5 + wordLines.length * 4.5) + 10;

  // ── 10. FOOTER ────────────────────────────────────────────────────────────
  // Push footer to near bottom of page (matches screenshot — large gap above footer)
  const footerY = pageH - 28;

  // Bank details — bottom left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(company.bankName, L, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`A/C. No.: ${company.accountNo}`, L, footerY + 5);
  doc.text(`IFSC: ${company.ifsc}`, L, footerY + 10);
  doc.text(`Branch: ${company.branch}`, L, footerY + 15);

  // Signatory — bottom right
  // Screenshot shows: "Authorised Signatory" (normal, smaller) then "For Rehoboth Timber and Furniture" (bold)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Authorised Signatory", R, footerY + 5, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`For ${company.signName}`, R, footerY + 11, { align: "right" });

  doc.save(`${filename}.pdf`);
  toast.success("PDF downloaded");
}

export default function AdminInvoicesPage() {
  const [selectedCompany, setSelectedCompany] = useState<
    "rehoboth" | "kirubai"
  >("rehoboth");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceNoFilter, setInvoiceNoFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loadInvoices = async (
    company: "rehoboth" | "kirubai" = selectedCompany,
  ) => {
    setLoading(true);
    try {
      const response = await getInvoices(company);
      setInvoices(response.data || []);
    } catch (error) {
      console.error("Failed to load invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices(selectedCompany);
  }, [selectedCompany]);

  const handleDeleteInvoice = async (invoice: Invoice) => {
    const confirmed = window.confirm(
      `Delete invoice ${invoice.invoiceNo || invoice._id}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setDeletingId(invoice._id);
      await deleteInvoice(invoice._id);
      setInvoices((prev) => prev.filter((item) => item._id !== invoice._id));
      toast.success("Invoice deleted successfully");
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkInvoice = async (invoice: Invoice, marked: boolean) => {
    try {
      setMarkingId(invoice._id);
      await markInvoice(invoice._id, marked);
      setInvoices((prev) =>
        prev.map((item) =>
          item._id === invoice._id ? { ...item, marked } : item,
        ),
      );
      toast.success(marked ? "Invoice marked" : "Invoice unmarked");
    } catch (error) {
      console.error("Failed to mark invoice:", error);
      toast.error("Failed to update mark status");
    } finally {
      setMarkingId(null);
    }
  };

  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(
        invoices
          .map((invoice) => normalizeDate(invoice.date || invoice.createdAt))
          .map((dateValue) => dateValue.slice(0, 4))
          .filter(Boolean),
      ),
    ).sort((a, b) => Number(b) - Number(a));

    return ["all", ...years];
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const normalizedDate = normalizeDate(invoice.date || invoice.createdAt);
      const invoiceYear = normalizedDate.slice(0, 4);
      const invoiceMonth = normalizedDate.slice(5, 7);
      const invoiceNo = invoice.invoiceNo?.toLowerCase() || "";
      const buyerName = invoice.buyerName?.toLowerCase() || "";
      const query = invoiceNoFilter.trim().toLowerCase();

      const matchesInvoiceNo =
        !query || invoiceNo.includes(query) || buyerName.includes(query);
      const matchesYear = yearFilter === "all" || invoiceYear === yearFilter;
      const matchesMonth =
        monthFilter === "all" || invoiceMonth === monthFilter;
      const matchesDate = !dateFilter || normalizedDate === dateFilter;

      return matchesInvoiceNo && matchesYear && matchesMonth && matchesDate;
    });
  }, [invoices, invoiceNoFilter, yearFilter, monthFilter, dateFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-sm text-gray-600">
          Manage generated bills and print them anytime.
        </p>
        <div className="mt-2 inline-flex rounded-md border border-black p-1 w-fit">
          <button
            type="button"
            onClick={() => setSelectedCompany("rehoboth")}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors cursor-pointer ${
              selectedCompany === "rehoboth"
                ? "bg-black text-white"
                : "text-black hover:bg-neutral-100"
            }`}
          >
            {COMPANY_MAP.rehoboth.label}
          </button>
          <button
            type="button"
            onClick={() => setSelectedCompany("kirubai")}
            className={`rounded px-3 py-1 text-sm font-medium transition-colors cursor-pointer ${
              selectedCompany === "kirubai"
                ? "bg-black text-white"
                : "text-black hover:bg-neutral-100"
            }`}
          >
            {COMPANY_MAP.kirubai.label}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Invoice No / Buyer
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                value={invoiceNoFilter}
                onChange={(event) => setInvoiceNoFilter(event.target.value)}
                placeholder="Search invoice number or buyer name"
                className="pl-8"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Year
            </label>
            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year === "all" ? "All years" : year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Month
            </label>
            <select
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Date
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </p>
          <Button
            variant="outline"
            onClick={() => loadInvoices(selectedCompany)}
            disabled={loading}
            className="cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="overflow-hidden border border-black bg-white">
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-black border-b border-black">
              <tr>
                <th className="px-4 py-3 text-left border-r border-black">
                  Invoice No
                </th>
                <th className="px-4 py-3 text-left border-r border-black">
                  Invoice Date
                </th>
                <th className="px-4 py-3 text-left border-r border-black">
                  Buyer
                </th>
                <th className="px-4 py-3 text-left border-r border-black">
                  Items
                </th>
                <th className="px-4 py-3 text-right border-r border-black">
                  Taxable
                </th>
                <th className="px-4 py-3 text-right border-r border-black">
                  Total
                </th>
                <th className="px-4 py-3 text-left border-r border-black">
                  Created
                </th>
                <th className="px-4 py-3 text-center border-r border-black">
                  Marked
                </th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black text-black">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-black" colSpan={9}>
                    Loading invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-black" colSpan={9}>
                    No invoices found for selected filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td className="px-4 py-3 font-medium text-black border-r border-black">
                      {invoice.invoiceNo || "-"}
                    </td>
                    <td className="px-4 py-3 text-black border-r border-black">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-4 py-3 text-black border-r border-black">
                      {invoice.buyerName || "-"}
                    </td>
                    <td className="px-4 py-3 text-black border-r border-black">
                      {invoice.items?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-right text-black border-r border-black">
                      {currency.format(invoice.taxableValue || 0)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-black border-r border-black">
                      {currency.format(invoice.totalValue || 0)}
                    </td>
                    <td className="px-4 py-3 text-black border-r border-black">
                      {formatDate(invoice.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center border-r border-black">
                      <input
                        type="checkbox"
                        checked={Boolean(invoice.marked)}
                        onChange={(event) =>
                          handleMarkInvoice(invoice, event.target.checked)
                        }
                        disabled={markingId === invoice._id}
                        className="h-4 w-4 cursor-pointer accent-black"
                        title="Mark invoice"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => downloadInvoicePdfWithJsPdf(invoice)}
                          title={`Download invoice ${invoice.invoiceNo}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => printInvoice(invoice)}
                          title={`Print invoice ${invoice.invoiceNo}`}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteInvoice(invoice)}
                          disabled={deletingId === invoice._id}
                          title={`Delete invoice ${invoice.invoiceNo}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
