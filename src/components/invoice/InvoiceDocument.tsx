"use client";

import { forwardRef } from "react";
import {
  COMPANY_CONFIG,
  type CompanyKey,
} from "@/lib/invoice/company-config";
import type { PrintType } from "@/components/invoice/PrintTypeModal";

export type InvoiceDocumentItem = {
  id?: string;
  particulars: string;
  hsnCode: string;
  uom: string;
  qty: string;
  rate: string;
  total: number;
};

export type InvoiceDocumentProps = {
  companyKey: CompanyKey;
  printType: PrintType;
  invoiceNo: string;
  date: string;
  buyerName: string;
  buyerAddress: string;
  customerGstin: string;
  customerStateCode: string;
  customerState: string;
  vehicleNo: string;
  items: InvoiceDocumentItem[];
  useIgst: boolean;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalValue: number;
  totalInWords: string;
};

export const InvoiceDocument = forwardRef<HTMLDivElement, InvoiceDocumentProps>(
  function InvoiceDocument(
    {
      companyKey,
      printType,
      invoiceNo,
      date,
      buyerName,
      buyerAddress,
      customerGstin,
      customerStateCode,
      customerState,
      vehicleNo,
      items,
      useIgst,
      taxableValue,
      cgst,
      sgst,
      igst,
      totalValue,
      totalInWords,
    },
    ref,
  ) {
    const company = COMPANY_CONFIG[companyKey];

    return (
      <div
        id="invoice-print"
        ref={ref}
        className="bg-white p-8 mx-auto text-black flex flex-col"
        style={{ width: "210mm", minHeight: "297mm" }}
      >
        {/* TAX INVOICE / ORIGINAL */}
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-semibold">TAX INVOICE</span>
          <span className="text-sm font-semibold">
            {printType === "original" ? "ORIGINAL" : "DUPLICATE"}
          </span>
        </div>

        {/* Header: Logo + Company */}
        <div className="flex gap-4 mb-6 pb-4 border-b border-black">
          <div className="flex-1">
            <p className="text-[10px] text-black mb-1">✝ {company.motto}</p>
            <h1 className="text-xl font-bold uppercase tracking-tight">
              {company.name}
            </h1>
            <p className="text-sm my-2">GSTIN/UIN: {company.gstin}</p>
            <p className="text-sm mt-1 leading-tight">
              {company.addressLines.map((line, index) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < company.addressLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Bill To / Buyer & Invoice Details */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-4 print:gap-x-2 print:gap-y-1">
          <div className="flex gap-2">
            <span className="w-24 flex-shrink-0">GSTIN No:</span>
            <span className="border-b border-black flex-1 min-w-[80px]">
              {customerGstin}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 flex-shrink-0">Invoice No:</span>
            <span className="border-b border-black flex-1">{invoiceNo}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 flex-shrink-0">State Code:</span>
            <span className="border-b border-black flex-1 min-w-[40px]">
              {customerStateCode}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 flex-shrink-0">State:</span>
            <span className="border-b border-black flex-1 min-w-[80px]">
              {customerState}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 flex-shrink-0">Buyer Name:</span>
            <span className="border-b border-black flex-1">{buyerName}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 flex-shrink-0">Vehicle No.:</span>
            <span className="border-b border-black flex-1">{vehicleNo}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-24 flex-shrink-0">Date:</span>
            <span className="border-b border-black flex-1">{date}</span>
          </div>
          <div className="col-span-2 mt-2">
            <span className="block text-xs font-medium mb-1">
              Customer Address:
            </span>
            <p className="text-sm border-b border-black pb-1 min-h-[2.5rem] whitespace-pre-wrap">
              {buyerAddress || "—"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-4 border border-black min-h-[108mm] relative">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-y-0 left-[5%] border-l border-black" />
            <div className="absolute inset-y-0 left-[37%] border-l border-black" />
            <div className="absolute inset-y-0 left-[49%] border-l border-black" />
            <div className="absolute inset-y-0 left-[57%] border-l border-black" />
            <div className="absolute inset-y-0 left-[67%] border-l border-black" />
            <div className="absolute inset-y-0 left-[80%] border-l border-black" />
          </div>
          <table className="w-full border-collapse text-sm text-black relative z-10">
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "32%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-black">
                <th className="border-b border-black px-3 py-2 text-center font-semibold">
                  Sl. No.
                </th>
                <th className="border-b border-black px-3 py-2 text-left font-semibold">
                  Particulars
                </th>
                <th className="border-b border-black px-3 py-2 font-semibold">
                  HSN Code
                </th>
                <th className="border-b border-black px-3 py-2 font-semibold">
                  UOM
                </th>
                <th className="border-b border-black px-3 py-2 text-right font-semibold">
                  Qty.
                </th>
                <th className="border-b border-black px-3 py-2 text-right font-semibold">
                  Rate
                </th>
                <th className="border-b border-black px-3 py-2 text-right font-semibold">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="align-top">
              {items.map((item, idx) => (
                <tr key={item.id ?? `${item.particulars}-${idx}`}>
                  <td className="px-3 py-2 text-center">{idx + 1}</td>
                  <td className="px-3 py-2">{item.particulars}</td>
                  <td className="px-3 py-2">{item.hsnCode}</td>
                  <td className="px-3 py-2">{item.uom}</td>
                  <td className="px-3 py-2 text-right">{item.qty || ""}</td>
                  <td className="px-3 py-2 text-right">{item.rate}</td>
                  <td className="px-3 py-2 text-right [font-variant-numeric:tabular-nums]">
                    {Number(item.total || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary + Total in Words */}
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="flex-1 text-sm">
            <p className="font-medium mb-1">Total Value in Words:</p>
            <p className="pb-1 break-words">{totalInWords}</p>
          </div>

          <div className="w-64 space-y-1 text-sm shrink-0">
            <div className="flex justify-between">
              <span>TAXABLE VALUE:</span>
              <span>{taxableValue.toFixed(2)}</span>
            </div>
            {!useIgst && (
              <>
                <div className="flex justify-between">
                  <span>CGST @ 9%:</span>
                  <span>{cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST @ 9%:</span>
                  <span>{sgst.toFixed(2)}</span>
                </div>
              </>
            )}
            {useIgst && (
              <div className="flex justify-between">
                <span>IGST @ 18%:</span>
                <span>{igst.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-1 border-t border-black">
              <span>TOTAL VALUE:</span>
              <span>₹{totalValue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end pt-4 mt-auto">
          <div className="text-sm">
            <p className="font-medium">{company.bankName}</p>
            <p>A/C. No.: {company.accountNo}</p>
            <p>IFSC: {company.ifsc}</p>
            <p>Branch: {company.branch}</p>
          </div>
          <div className="text-center">
            <p className="text-xs">Authorised Signatory</p>
            <p className="text-sm font-medium mb-0">For {company.signName}</p>
          </div>
        </div>
      </div>
    );
  },
);
