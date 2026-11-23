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
                          onClick={() => openPrintModal(invoice)}
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
