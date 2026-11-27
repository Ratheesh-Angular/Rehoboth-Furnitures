"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";
import {
  PrintTypeModal,
  type PrintType,
} from "@/components/invoice/PrintTypeModal";
import {
  COMPANY_CONFIG,
  type CompanyKey,
} from "@/lib/invoice/company-config";
import { printInvoiceNode } from "@/lib/invoice/print-invoice";
import {
  Invoice,
  deleteInvoice,
  getInvoices,
  markInvoice,
} from "@/lib/api/invoice.api";
import { numberToWords } from "@/lib/utils/number-to-words";

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

export default function AdminInvoicesPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyKey>("rehoboth");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceNoFilter, setInvoiceNoFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const [isPrintTypeModalOpen, setIsPrintTypeModalOpen] = useState(false);
  const [printType, setPrintType] = useState<PrintType>("original");
  const [pendingInvoice, setPendingInvoice] = useState<Invoice | null>(null);
  const [printJob, setPrintJob] = useState<{
    invoice: Invoice;
    printType: PrintType;
  } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadJob, setDownloadJob] = useState<Invoice | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const loadInvoices = async (company: CompanyKey = selectedCompany) => {
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

  useEffect(() => {
    if (!printJob) return;

    // Wait until InvoiceDocument is mounted and painted before cloning DOM.
    const timer = window.setTimeout(() => {
      const invoiceNode = printRef.current;
      if (!invoiceNode) {
        toast.error("Unable to prepare invoice for printing.");
        setPrintJob(null);
        return;
      }
      const opened = printInvoiceNode(invoiceNode);
      if (!opened) {
        toast.error("Unable to open print preview. Please allow pop-ups.");
      }
      setPrintJob(null);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [printJob]);

  useEffect(() => {
    if (!downloadJob) return;

    // Wait until the off-screen Original + Duplicate template is mounted.
    const timer = window.setTimeout(async () => {
      const invoice = downloadJob;
      try {
        const pdfNode = pdfRef.current;
        if (!pdfNode) {
          throw new Error("Invoice template is not ready");
        }
        const html2pdfModule = await import("html2pdf.js");
        const html2pdf = html2pdfModule.default || html2pdfModule;
        const safeNo = (invoice.invoiceNo || invoice._id || "invoice")
          .toString()
          .replace(/[^a-zA-Z0-9-_]+/g, "-");
        await html2pdf()
          .set({
            margin: 0,
            filename: `Invoice-${safeNo}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              backgroundColor: "#ffffff",
              onclone: (clonedDoc: Document) => {
                // Strip Tailwind v4 global stylesheets that use oklch()/lab() colors,
                // which crash html2canvas. The inline #pdf-wrapper stylesheet keeps the layout intact.
                clonedDoc
                  .querySelectorAll('style, link[rel="stylesheet"]')
                  .forEach((el) => {
                    if (!el.textContent?.includes("#pdf-wrapper")) {
                      el.remove();
                    }
                  });
                clonedDoc.documentElement.style.backgroundColor = "#ffffff";
                clonedDoc.body.style.backgroundColor = "#ffffff";
              },
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            // @ts-expect-error pagebreak is supported by html2pdf at runtime but missing from its type definitions
            pagebreak: {
              mode: ["css", "legacy"],
              before: ".invoice-pdf-duplicate",
            },
          })
          .from(pdfNode)
          .save();
        toast.success("Invoice downloaded");
      } catch (error) {
        console.error("Failed to generate invoice PDF:", error);
        toast.error("Failed to download invoice");
      } finally {
        document
          .querySelectorAll(".html2pdf__overlay, .html2pdf__container")
          .forEach((el) => el.remove());
        setDownloadJob(null);
        setDownloadingId(null);
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, [downloadJob]);

  const getDocProps = (invoice: Invoice) => {
    const totalValue = Number(invoice.totalValue || 0);
    return {
      companyKey: (invoice.company === "kirubai" ? "kirubai" : "rehoboth") as CompanyKey,
      date: invoice.date || normalizeDate(invoice.createdAt),
      invoiceNo: invoice.invoiceNo || "",
      buyerName: invoice.buyerName || "",
      buyerAddress: invoice.buyerAddress || "",
      customerGstin: invoice.customerGstin || "",
      customerStateCode: invoice.customerStateCode || "",
      customerState: invoice.customerState || "",
      vehicleNo: invoice.vehicleNo || "",
      items: invoice.items || [],
      useIgst: Boolean(invoice.useIgst),
      taxableValue: Number(invoice.taxableValue || 0),
      cgst: Number(invoice.cgst || 0),
      sgst: Number(invoice.sgst || 0),
      igst: Number(invoice.igst || 0),
      totalValue,
      totalInWords: numberToWords(totalValue),
    };
  };

  const downloadInvoicePdf = (invoice: Invoice) => {
    if (downloadingId) return;
    setDownloadingId(invoice._id);
    setDownloadJob(invoice);
  };

  const openPrintModal = (invoice: Invoice) => {
    setPendingInvoice(invoice);
    setPrintType("original");
    setIsPrintTypeModalOpen(true);
  };

  const confirmPrint = () => {
    if (!pendingInvoice) return;
    setIsPrintTypeModalOpen(false);
    setPrintJob({ invoice: pendingInvoice, printType });
    setPendingInvoice(null);
  };

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

  const activePrintInvoice = printJob?.invoice ?? null;
  const activePrintType = printJob?.printType ?? "original";
  const activeCompanyKey: CompanyKey =
    activePrintInvoice?.company === "kirubai" ? "kirubai" : "rehoboth";
  const activeInvoiceDate = activePrintInvoice
    ? activePrintInvoice.date ||
      normalizeDate(activePrintInvoice.createdAt)
    : "";
  const activeTotalValue = Number(activePrintInvoice?.totalValue || 0);

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
            {COMPANY_CONFIG.rehoboth.label}
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
            {COMPANY_CONFIG.kirubai.label}
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
                          onClick={() => downloadInvoicePdf(invoice)}
                          disabled={downloadingId === invoice._id}
                          title={`Download invoice ${invoice.invoiceNo}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => openPrintModal(invoice)}
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

      <PrintTypeModal
        open={isPrintTypeModalOpen}
        printType={printType}
        onPrintTypeChange={setPrintType}
        onClose={() => {
          setIsPrintTypeModalOpen(false);
          setPendingInvoice(null);
        }}
        onConfirm={confirmPrint}
      />

      {/* Off-screen mount for the combined Original + Duplicate download PDF */}
      {downloadJob && (
        <div
          aria-hidden
          className="pointer-events-none fixed left-[-10000px] top-0"
        >
          <div id="pdf-wrapper" ref={pdfRef}>
            <style>{`
              #pdf-wrapper { background: #ffffff; color: #000000; font-family: Arial, Helvetica, sans-serif; box-sizing: border-box; }
              #pdf-wrapper *, #pdf-wrapper *::before, #pdf-wrapper *::after { box-sizing: border-box; border-color: #000000; outline-color: transparent; }
              #pdf-wrapper .bg-white { background-color: #ffffff; }
              #pdf-wrapper .p-8 { padding: 32px; }
              #pdf-wrapper .mx-auto { margin-left: auto; margin-right: auto; }
              #pdf-wrapper .text-black { color: #000000; }
              #pdf-wrapper .flex { display: flex; }
              #pdf-wrapper .flex-col { flex-direction: column; }
              #pdf-wrapper .flex-1 { flex: 1 1 0%; }
              #pdf-wrapper .shrink-0, #pdf-wrapper .flex-shrink-0 { flex-shrink: 0; }
              #pdf-wrapper .justify-between { justify-content: space-between; }
              #pdf-wrapper .items-start { align-items: flex-start; }
              #pdf-wrapper .items-end { align-items: flex-end; }
              #pdf-wrapper .gap-4 { gap: 16px; }
              #pdf-wrapper .gap-2 { gap: 8px; }
              #pdf-wrapper .gap-x-8 { column-gap: 32px; }
              #pdf-wrapper .gap-y-2 { row-gap: 8px; }
              #pdf-wrapper .mb-0 { margin-bottom: 0; }
              #pdf-wrapper .mb-1 { margin-bottom: 4px; }
              #pdf-wrapper .mb-4 { margin-bottom: 16px; }
              #pdf-wrapper .mb-6 { margin-bottom: 24px; }
              #pdf-wrapper .mt-1 { margin-top: 4px; }
              #pdf-wrapper .mt-2 { margin-top: 8px; }
              #pdf-wrapper .mt-auto { margin-top: auto; }
              #pdf-wrapper .my-2 { margin-top: 8px; margin-bottom: 8px; }
              #pdf-wrapper .pb-1 { padding-bottom: 4px; }
              #pdf-wrapper .pb-4 { padding-bottom: 16px; }
              #pdf-wrapper .pt-1 { padding-top: 4px; }
              #pdf-wrapper .pt-4 { padding-top: 16px; }
              #pdf-wrapper .px-3 { padding-left: 12px; padding-right: 12px; }
              #pdf-wrapper .py-2 { padding-top: 8px; padding-bottom: 8px; }
              #pdf-wrapper .border { border: 1px solid #000000; }
              #pdf-wrapper .border-b { border-bottom: 1px solid #000000; }
              #pdf-wrapper .border-t { border-top: 1px solid #000000; }
              #pdf-wrapper .border-l { border-left: 1px solid #000000; }
              #pdf-wrapper .border-black { border-color: #000000; }
              #pdf-wrapper .text-\\[10px\\] { font-size: 10px; line-height: 14px; }
              #pdf-wrapper .text-\\[11px\\] { font-size: 11px; line-height: 15px; }
              #pdf-wrapper .text-xs { font-size: 12px; line-height: 16px; }
              #pdf-wrapper .text-sm { font-size: 14px; line-height: 20px; }
              #pdf-wrapper .text-xl { font-size: 20px; line-height: 28px; }
              #pdf-wrapper .font-medium { font-weight: 500; }
              #pdf-wrapper .font-semibold { font-weight: 600; }
              #pdf-wrapper .font-bold { font-weight: 700; }
              #pdf-wrapper .uppercase { text-transform: uppercase; }
              #pdf-wrapper .tracking-tight { letter-spacing: -0.025em; }
              #pdf-wrapper .tracking-wide { letter-spacing: 0.025em; }
              #pdf-wrapper .leading-tight { line-height: 1.25; }
              #pdf-wrapper .grid { display: grid; }
              #pdf-wrapper .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
              #pdf-wrapper .col-span-2 { grid-column: span 2 / span 2; }
              #pdf-wrapper .w-24 { width: 96px; }
              #pdf-wrapper .w-64 { width: 256px; }
              #pdf-wrapper .w-full { width: 100%; }
              #pdf-wrapper .min-w-\\[40px\\] { min-width: 40px; }
              #pdf-wrapper .min-w-\\[80px\\] { min-width: 80px; }
              #pdf-wrapper .min-h-\\[2\\.5rem\\] { min-height: 40px; }
              #pdf-wrapper .min-h-\\[108mm\\] { min-height: 95mm; }
              #pdf-wrapper .block { display: block; }
              #pdf-wrapper .whitespace-pre-wrap { white-space: pre-wrap; }
              #pdf-wrapper .break-words { word-break: break-word; overflow-wrap: break-word; }
              #pdf-wrapper .relative { position: relative; }
              #pdf-wrapper .absolute { position: absolute; }
              #pdf-wrapper .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
              #pdf-wrapper .inset-y-0 { top: 0; bottom: 0; }
              #pdf-wrapper .pointer-events-none { pointer-events: none; }
              #pdf-wrapper .z-10 { z-index: 10; }
              #pdf-wrapper .left-\\[5\\%\\] { left: 5%; }
              #pdf-wrapper .left-\\[37\\%\\] { left: 37%; }
              #pdf-wrapper .left-\\[49\\%\\] { left: 49%; }
              #pdf-wrapper .left-\\[57\\%\\] { left: 57%; }
              #pdf-wrapper .left-\\[67\\%\\] { left: 67%; }
              #pdf-wrapper .left-\\[80\\%\\] { left: 80%; }
              #pdf-wrapper .border-collapse { border-collapse: collapse; }
              #pdf-wrapper .align-top { vertical-align: top; }
              #pdf-wrapper .text-center { text-align: center; }
              #pdf-wrapper .text-left { text-align: left; }
              #pdf-wrapper .text-right { text-align: right; }
              #pdf-wrapper .\\[font-variant-numeric\\:tabular-nums\\] { font-variant-numeric: tabular-nums; }
              #pdf-wrapper .space-y-1 > * + * { margin-top: 4px; }
              #pdf-wrapper p, #pdf-wrapper h1 { margin-top: 0; }
              #pdf-wrapper .invoice-pdf-page > div {
                width: 210mm !important;
                min-height: 295mm !important;
                height: 295mm !important;
                max-height: 295mm !important;
                padding: 8mm 8mm !important;
                overflow: hidden !important;
              }
              #pdf-wrapper .invoice-pdf-duplicate {
                page-break-before: always;
                break-before: page;
              }
            `}</style>
            <div className="invoice-pdf-page">
              <InvoiceDocument {...getDocProps(downloadJob)} printType="original" />
            </div>
            <div className="invoice-pdf-page invoice-pdf-duplicate">
              <InvoiceDocument {...getDocProps(downloadJob)} printType="duplicate" />
            </div>
          </div>
        </div>
      )}

      {/* Off-screen mount of the shared billing invoice template for print/download */}
      {activePrintInvoice && (
        <div
          aria-hidden
          className="pointer-events-none fixed left-[-10000px] top-0"
        >
          <InvoiceDocument
            ref={printRef}
            companyKey={activeCompanyKey}
            printType={activePrintType}
            invoiceNo={activePrintInvoice.invoiceNo || ""}
            date={activeInvoiceDate}
            buyerName={activePrintInvoice.buyerName || ""}
            buyerAddress={activePrintInvoice.buyerAddress || ""}
            customerGstin={activePrintInvoice.customerGstin || ""}
            customerStateCode={activePrintInvoice.customerStateCode || ""}
            customerState={activePrintInvoice.customerState || ""}
            vehicleNo={activePrintInvoice.vehicleNo || ""}
            items={activePrintInvoice.items || []}
            useIgst={Boolean(activePrintInvoice.useIgst)}
            taxableValue={Number(activePrintInvoice.taxableValue || 0)}
            cgst={Number(activePrintInvoice.cgst || 0)}
            sgst={Number(activePrintInvoice.sgst || 0)}
            igst={Number(activePrintInvoice.igst || 0)}
            totalValue={activeTotalValue}
            totalInWords={numberToWords(activeTotalValue)}
          />
        </div>
      )}
    </div>
  );
}
