import api from "./axios";

export interface CustomerProfile {
  buyerName: string;
  buyerAddress: string;
  customerGstin: string;
  customerStateCode: string;
  customerState: string;
  vehicleNo: string;
  lastUsedAt: string;
}

export interface InvoiceItem {
  particulars: string;
  hsnCode: string;
  uom: string;
  qty: string;
  rate: string;
  total: number;
}

export interface Invoice {
  _id: string;
  company: "rehoboth" | "kirubai";
  marked?: boolean;
  invoiceNo: string;
  date: string;
  buyerName: string;
  buyerAddress: string;
  customerGstin: string;
  customerStateCode: string;
  customerState: string;
  vehicleNo: string;
  items: InvoiceItem[];
  useIgst: boolean;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoicePayload {
  company: "rehoboth" | "kirubai";
  invoiceNo: string;
  date: string;
  buyerName: string;
  buyerAddress: string;
  customerGstin: string;
  customerStateCode: string;
  customerState: string;
  vehicleNo: string;
  items: InvoiceItem[];
  useIgst: boolean;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalValue: number;
}

export const createInvoice = async (data: InvoicePayload) => {
  const res = await api.post("/invoices", data);
  return res.data;
};

export const getInvoices = async (company?: "rehoboth" | "kirubai") => {
  const res = await api.get("/invoices", {
    params: company ? { company } : undefined,
  });
  return res.data as { success: boolean; data: Invoice[] };
};

export const getInvoiceById = async (id: string) => {
  const res = await api.get(`/invoices/${id}`);
  return res.data as { success: boolean; data: Invoice };
};

export const deleteInvoice = async (id: string) => {
  const res = await api.delete(`/invoices/${id}`);
  return res.data as { success: boolean; message: string };
};

export const markInvoice = async (id: string, marked: boolean) => {
  const res = await api.post(`/invoices/${id}/mark`, { marked });
  return res.data as { success: boolean; message: string; data: Invoice };
};

export const getCustomerProfiles = async (
  company: "rehoboth" | "kirubai",
  query?: string,
) => {
  const res = await api.get("/customers", {
    params: {
      company,
      ...(query ? { q: query } : {}),
    },
  });
  return res.data as { success: boolean; data: CustomerProfile[] };
};
