"use client";
// 5. Import createPortal at the top of your file:

import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, Trash2, Printer, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";
import {
  PrintTypeModal,
  type PrintType,
} from "@/components/invoice/PrintTypeModal";
import { type CompanyKey } from "@/lib/invoice/company-config";
import { printInvoiceNode } from "@/lib/invoice/print-invoice";
import { numberToWords } from "@/lib/utils/number-to-words";
import { createInvoice, getCustomerProfiles } from "@/lib/api/invoice.api";
import { getBillingItems } from "@/lib/api/billing-item.api";
import { createPortal } from "react-dom";

interface InvoiceItem {
  id: string;
  particulars: string;
  hsnCode: string;
  uom: string;
  qty: string;
  rate: string;
  total: number;
}

export default function BillingPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const customerDropdownRef = useRef<HTMLDivElement>(null);
  const itemDropdownContainerRef = useRef<HTMLTableSectionElement>(null);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyKey>("rehoboth");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [customerGstin, setCustomerGstin] = useState("");
  const [customerStateCode, setCustomerStateCode] = useState("33");
  const [customerState, setCustomerState] = useState("Tamil Nadu");
  const [vehicleNo, setVehicleNo] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      particulars: "",
      hsnCode: "",
      uom: "",
      qty: "",
      rate: "",
      total: 0,
    },
  ]);
  const [useIgst, setUseIgst] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [customers, setCustomers] = useState<
    {
      buyerName: string;
      buyerAddress: string;
      customerGstin: string;
      customerStateCode: string;
      customerState: string;
      vehicleNo: string;
    }[]
  >([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [billingItemOptions, setBillingItemOptions] = useState<
    { productName: string; hsnCode: string }[]
  >([]);
  const [isBillingItemsLoading, setIsBillingItemsLoading] = useState(false);

  const filteredCustomers = useMemo(() => {
    const query = customerSearch.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter(
      (customer) =>
        customer.buyerName.toLowerCase().includes(query) ||
        customer.customerGstin.toLowerCase().includes(query) ||
        customer.vehicleNo.toLowerCase().includes(query),
    );
  }, [customers, customerSearch]);

  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [activeParticularDropdownId, setActiveParticularDropdownId] = useState<
    string | null
  >(null);

  const [isPrintTypeModalOpen, setIsPrintTypeModalOpen] = useState(false);
  const [printType, setPrintType] = useState<PrintType>("original");

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        particulars: "",
        hsnCode: "",
        uom: "",
        qty: "",
        rate: "",
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "rate" || field === "uom") {
          // const qty =
          //   parseFloat(field === "qty" ? String(value) : item.qty) || 0;
          // const rate =
          //   parseFloat(field === "rate" ? String(value) : item.rate) || 0;
          // updated.total = Math.round(qty * rate * 100) / 100;
          // Extract numeric prefix from uom (e.g. "10cft" → 10)
          const uomVal = field === "uom" ? String(value) : item.uom;
          const uomNumeric = parseFloat(uomVal) || 0;

          const qty =
            uomNumeric > 0
              ? uomNumeric
              : parseFloat(field === "qty" ? String(value) : item.qty) || 0;

          const rate =
            parseFloat(field === "rate" ? String(value) : item.rate) || 0;
          updated.total = Math.round(qty * rate * 100) / 100;
        }
        return updated;
      }),
    );
  };

  const taxableValue = items.reduce((sum, i) => sum + i.total, 0);
  const taxRate = 0.09;
  const cgst = useIgst ? 0 : Math.round(taxableValue * taxRate * 100) / 100;
  const sgst = useIgst ? 0 : Math.round(taxableValue * taxRate * 100) / 100;
  const igst = useIgst ? Math.round(taxableValue * taxRate * 2 * 100) / 100 : 0;
  const totalValue = taxableValue + cgst + sgst + igst;
  const totalInWords = numberToWords(totalValue);

  const handlePrint = () => {
    const invoiceNode = printRef.current;
    if (!invoiceNode) return;
    const opened = printInvoiceNode(invoiceNode);
    if (!opened) {
      toast.error("Unable to open print preview. Please allow pop-ups.");
    }
  };

  const handleSave = async () => {
    if (!invoiceNo.trim()) {
      toast.error("Please enter an Invoice No.");
      return;
    }
    setIsSaving(true);
    try {
      await createInvoice({
        company: selectedCompany,
        invoiceNo: invoiceNo.trim(),
        date,
        buyerName,
        buyerAddress,
        customerGstin,
        customerStateCode,
        customerState,
        vehicleNo,
        items: items.map(({ id, ...rest }) => rest),
        useIgst,
        taxableValue,
        cgst,
        sgst,
        igst,
        totalValue,
      });
      toast.success("Invoice saved successfully");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;
      toast.error(msg || "Failed to save invoice");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("billing-page");
    return () => document.body.classList.remove("billing-page");
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCustomerDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (
        activeParticularDropdownId &&
        !target.closest("[data-billing-item-dropdown]")
      ) {
        setActiveParticularDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [activeParticularDropdownId]);

  const applyCustomer = (customer: {
    buyerName: string;
    buyerAddress: string;
    customerGstin: string;
    customerStateCode: string;
    customerState: string;
    vehicleNo: string;
  }) => {
    setBuyerName(customer.buyerName || "");
    setBuyerAddress(customer.buyerAddress || "");
    setCustomerGstin(customer.customerGstin || "");
    setCustomerStateCode(customer.customerStateCode || "33");
    setCustomerState(customer.customerState || "Tamil Nadu");
    setVehicleNo(customer.vehicleNo || "");
    setCustomerSearch(customer.buyerName || "");
    setSelectedCustomerName(customer.buyerName || "");
    setIsCustomerDropdownOpen(false);
  };

  const loadCustomers = async (company: CompanyKey) => {
    setIsCustomersLoading(true);
    try {
      const response = await getCustomerProfiles(company);
      setCustomers(response.data || []);
    } catch (error) {
      console.error("Failed to load customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setIsCustomersLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers(selectedCompany);
    setSelectedCustomerName("");
    setCustomerSearch("");
  }, [selectedCompany]);

  const loadBillingItemOptions = async () => {
    setIsBillingItemsLoading(true);
    try {
      const response = await getBillingItems();
      const byName = new Map<string, { productName: string; hsnCode: string }>();
      for (const item of response.data || []) {
        const productName = String(item.productName || "").trim();
        if (!productName || byName.has(productName)) continue;
        byName.set(productName, {
          productName,
          hsnCode: String(item.hsnCode || "").trim(),
        });
      }
      setBillingItemOptions(Array.from(byName.values()));
    } catch (error) {
      console.error("Failed to load billing items:", error);
      toast.error("Failed to load billing items");
    } finally {
      setIsBillingItemsLoading(false);
    }
  };

  const selectParticular = (
    id: string,
    productName: string,
    hsnCode: string,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, particulars: productName, hsnCode }
          : item,
      ),
    );
  };

  useEffect(() => {
    loadBillingItemOptions();
  }, []);

  const clearForm = () => {
    setInvoiceNo("");
    setDate(new Date().toISOString().split("T")[0]);
    setBuyerName("");
    setBuyerAddress("");
    setCustomerGstin("");
    setCustomerStateCode("33");
    setCustomerState("Tamil Nadu");
    setVehicleNo("");
    setCustomerSearch("");
    setSelectedCustomerName("");
    setIsCustomerDropdownOpen(false);
    setItems([
      {
        id: Date.now().toString(),
        particulars: "",
        hsnCode: "",
        uom: "",
        qty: "",
        rate: "",
        total: 0,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-stone-100 print:bg-white text-black">
      <div className="flex flex-col lg:flex-row gap-4 p-4 min-h-screen">
        {/* Left: Form - 50% width */}
        <div className="flex-1 min-w-0 overflow-y-auto no-print">
          <div className="mb-6">
            <div className="mb-3 inline-flex rounded-md border border-black p-1">
              <button
                type="button"
                onClick={() => setSelectedCompany("rehoboth")}
                className={`rounded px-3 py-1 text-sm font-medium transition-colors cursor-pointer ${
                  selectedCompany === "rehoboth"
                    ? "bg-black text-white"
                    : "text-black hover:bg-neutral-100"
                }`}
              >
                Rehoboth
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
                Kirubai
              </button>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-black">Tax Invoice</h1>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setPrintType("original");
                    setIsPrintTypeModalOpen(true);
                  }}
                  className="bg-black hover:bg-neutral-900 cursor-pointer"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print (A4)
                </Button>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div ref={customerDropdownRef} className="relative">
              <label className="block text-xs font-medium text-black mb-1">
                Existing Customer (Search & Select)
              </label>
              <Input
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setIsCustomerDropdownOpen(true);
                }}
                onFocus={() => setIsCustomerDropdownOpen(true)}
                onClick={() => setIsCustomerDropdownOpen(true)}
                placeholder={
                  isCustomersLoading
                    ? "Loading customers..."
                    : "Type customer name to search"
                }
              />
              {isCustomerDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-black bg-white shadow-lg">
                  <div className="max-h-56 overflow-y-auto">
                    {isCustomersLoading ? (
                      <p className="px-3 py-2 text-sm text-black/70">
                        Loading customers...
                      </p>
                    ) : filteredCustomers.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-black/70">
                        No customers found for this search.
                      </p>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <button
                          key={`${customer.buyerName}-${customer.customerGstin}-${customer.vehicleNo}`}
                          type="button"
                          onClick={() => applyCustomer(customer)}
                          className={`w-full px-3 py-2 text-left text-sm cursor-pointer border-b border-black/10 last:border-b-0 ${
                            selectedCustomerName === customer.buyerName
                              ? "bg-neutral-100"
                              : "bg-white"
                          }`}
                        >
                          <p className="font-medium">{customer.buyerName}</p>
                          <p className="text-[11px] opacity-80">
                            {customer.customerGstin
                              ? `GSTIN: ${customer.customerGstin}`
                              : "No GSTIN"}{" "}
                            {customer.vehicleNo
                              ? `| Vehicle: ${customer.vehicleNo}`
                              : ""}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
              <p className="mt-1 text-[11px] text-black/70">
                Selecting an existing customer auto-fills name, address, GSTIN,
                state, and vehicle details.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Invoice No.
                </label>
                <Input
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  placeholder="Invoice number"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Buyer Name
                </label>
                <Input
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder=""
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Vehicle No.
                </label>
                <Input
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="Vehicle number"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  Customer GSTIN
                </label>
                <Input
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value)}
                  placeholder="GSTIN"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  State Code
                </label>
                <Input
                  value={customerStateCode}
                  onChange={(e) => setCustomerStateCode(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black mb-1">
                  State
                </label>
                <Input
                  value={customerState}
                  onChange={(e) => setCustomerState(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useIgst}
                    onChange={(e) => setUseIgst(e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  <span className="text-sm text-black">Inter-state (IGST)</span>
                </label>
              </div>
            </div>

            {/* Buyer Address - Third row */}
            <div>
              <label className="block text-xs font-medium text-black mb-1">
                Customer Address
              </label>
              <Textarea
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                placeholder=" "
                className="resize-none"
              />
            </div>

            {/* Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-black">Items</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </div>
              <div className="border border-black overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="p-2 text-left w-8 border-r border-black">
                        #
                      </th>
                      <th className="p-2 text-left min-w-[180px] border-r border-black">
                        Particulars
                      </th>
                      <th className="p-2 text-left w-24 border-r border-black">
                        HSN
                      </th>
                      <th className="p-2 text-left w-16 border-r border-black">
                        UOM
                      </th>
                      <th className="p-2 text-right w-28 border-r border-black">
                        Qty
                      </th>
                      <th className="p-2 text-right w-32 border-r border-black">
                        Rate
                      </th>
                      <th className="p-2 text-right w-24 border-r border-black">
                        Total
                      </th>
                      <th className="p-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody ref={itemDropdownContainerRef}>
                    {items.map((item, idx) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="p-2 border-r border-black">{idx + 1}</td>
                        {/* <td className="p-2 border-r border-black">
                          <div
                            className="relative"
                            data-billing-item-dropdown
                            data-item-id={item.id}
                          >
                            <Input
                              value={item.particulars}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "particulars",
                                  e.target.value,
                                )
                              }
                              onFocus={() =>
                                setActiveParticularDropdownId(item.id)
                              }
                              onClick={() =>
                                setActiveParticularDropdownId(item.id)
                              }
                              className="border-0 h-8 focus-visible:ring-0"
                            />
                            {activeParticularDropdownId === item.id && (
                              <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-black bg-white shadow-lg">
                                <div className="max-h-52 overflow-y-auto">
                                  {isBillingItemsLoading ? (
                                    <p className="px-3 py-2 text-sm text-black/70">
                                      Loading items...
                                    </p>
                                  ) : billingItemOptions.filter((name) =>
                                      name
                                        .toLowerCase()
                                        .includes(
                                          item.particulars.toLowerCase(),
                                        ),
                                    ).length === 0 ? (
                                    <p className="px-3 py-2 text-sm text-black/70">
                                      No items found. You can type a new item.
                                    </p>
                                  ) : (
                                    billingItemOptions
                                      .filter((name) =>
                                        name
                                          .toLowerCase()
                                          .includes(
                                            item.particulars.toLowerCase(),
                                          ),
                                      )
                                      .map((name) => (
                                        <button
                                          key={`${item.id}-${name}`}
                                          type="button"
                                          onClick={() => {
                                            updateItem(
                                              item.id,
                                              "particulars",
                                              name,
                                            );
                                            setActiveParticularDropdownId(null);
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm cursor-pointer border-b border-black/10 last:border-b-0"
                                        >
                                          {name}
                                        </button>
                                      ))
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </td> */}
                        <td className="p-2 border-r border-black">
                          <div
                            className="relative"
                            data-billing-item-dropdown
                            data-item-id={item.id}
                          >
                            <Input
                              value={item.particulars}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "particulars",
                                  e.target.value,
                                )
                              }
                              onFocus={(e) => {
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                setDropdownPosition({
                                  top: rect.bottom + window.scrollY,
                                  left: rect.left + window.scrollX,
                                  width: rect.width,
                                });
                                setActiveParticularDropdownId(item.id);
                              }}
                              onClick={(e) => {
                                const rect =
                                  e.currentTarget.getBoundingClientRect();
                                setDropdownPosition({
                                  top: rect.bottom + window.scrollY,
                                  left: rect.left + window.scrollX,
                                  width: rect.width,
                                });
                                setActiveParticularDropdownId(item.id);
                              }}
                              onBlur={() => {
                                setTimeout(() => {
                                  setActiveParticularDropdownId(null);
                                  setDropdownPosition(null);
                                }, 150);
                              }}
                              className="border-0 h-8 focus-visible:ring-0"
                            />
                          </div>
                        </td>
                        <td className="p-2 border-r border-black">
                          <Input
                            value={item.hsnCode}
                            onChange={(e) =>
                              updateItem(item.id, "hsnCode", e.target.value)
                            }
                            className="border-0 h-8 focus-visible:ring-0"
                          />
                        </td>
                        {/* <td className="p-2 border-r border-black">
                          <Input
                            value={item.uom}
                            onChange={(e) =>
                              updateItem(item.id, "uom", e.target.value)
                            }
                            className="border-0 h-8 focus-visible:ring-0"
                          />
                        </td> */}
                        <td className="p-2 border-r border-black min-w-[100px]">
                          <Input
                            value={item.uom}
                            onChange={(e) =>
                              updateItem(item.id, "uom", e.target.value)
                            }
                            className="border-0 h-8 focus-visible:ring-0 min-w-[84px]"
                          />
                        </td>
                        <td className="p-2 text-right min-w-[112px] border-r border-black">
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              updateItem(item.id, "qty", e.target.value)
                            }
                            className="w-full min-w-[96px] border-0 h-8 text-right focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="p-2 text-right min-w-[128px] border-r border-black">
                          <Input
                            type="number"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(item.id, "rate", e.target.value)
                            }
                            className="w-full min-w-[112px] border-0 h-8 text-right focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </td>
                        <td className="p-2 text-right font-medium border-r border-black">
                          {item.total.toFixed(2)}
                        </td>
                        <td className="p-2">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {activeParticularDropdownId !== null &&
                  dropdownPosition &&
                  createPortal(
                    <div
                      className="absolute z-[9999] overflow-hidden rounded-md border border-black bg-white shadow-lg"
                      style={{
                        top: dropdownPosition.top + 4,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                      }}
                    >
                      <div className="max-h-52 overflow-y-auto">
                        {(() => {
                          const activeItem = items.find(
                            (i) => i.id === activeParticularDropdownId,
                          );
                          if (!activeItem) return null;

                          if (isBillingItemsLoading) {
                            return (
                              <p className="px-3 py-2 text-sm text-black/70">
                                Loading items...
                              </p>
                            );
                          }

                          const filtered = billingItemOptions.filter((option) =>
                            option.productName
                              .toLowerCase()
                              .includes(activeItem.particulars.toLowerCase()),
                          );

                          return filtered.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-black/70">
                              No items found. You can type a new item.
                            </p>
                          ) : (
                            filtered.map((option) => (
                              <button
                                key={`${activeItem.id}-${option.productName}`}
                                type="button"
                                onMouseDown={(e) => {
                                  // onMouseDown fires before onBlur, so selection works correctly
                                  e.preventDefault();
                                  selectParticular(
                                    activeItem.id,
                                    option.productName,
                                    option.hsnCode,
                                  );
                                  setActiveParticularDropdownId(null);
                                  setDropdownPosition(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm cursor-pointer border-b border-black/10 last:border-b-0"
                              >
                                {option.productName}
                              </button>
                            ))
                          );
                        })()}
                      </div>
                    </div>,
                    document.body,
                  )}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                variant="outline"
                className="cursor-pointer border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving…" : "Save to Database"}
              </Button>
              {/* <Button
                onClick={handlePrint}
                className="bg-stone-800 hover:bg-stone-900 cursor-pointer"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button> */}
              <Button
                variant="outline"
                onClick={clearForm}
                className="cursor-pointer"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        <PrintTypeModal
          open={isPrintTypeModalOpen}
          printType={printType}
          onPrintTypeChange={setPrintType}
          onClose={() => setIsPrintTypeModalOpen(false)}
          onConfirm={() => {
            setIsPrintTypeModalOpen(false);
            handlePrint();
          }}
        />

        {/* Right: Invoice preview - 50% width */}
        <div className="flex-1 min-w-0 overflow-auto bg-stone-200/50 p-4">
          <div
            className="scale-[0.96] origin-top-left shadow-lg"
            style={{ width: 794, height: 1123 }}
          >
            <InvoiceDocument
              ref={printRef}
              companyKey={selectedCompany}
              printType={printType}
              invoiceNo={invoiceNo}
              date={date}
              buyerName={buyerName}
              buyerAddress={buyerAddress}
              customerGstin={customerGstin}
              customerStateCode={customerStateCode}
              customerState={customerState}
              vehicleNo={vehicleNo}
              items={items}
              useIgst={useIgst}
              taxableValue={taxableValue}
              cgst={cgst}
              sgst={sgst}
              igst={igst}
              totalValue={totalValue}
              totalInWords={totalInWords}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
