import mongoose, { Document, Model, Schema } from "mongoose";

export interface IInvoiceItem {
  particulars: string;
  hsnCode: string;
  uom: string;
  qty: string;
  rate: string;
  total: number;
}

export interface IInvoice extends Document {
  company: "rehoboth" | "kirubai";
  marked: boolean;
  invoiceNo: string;
  date: string;
  buyerName: string;
  buyerAddress: string;
  customerGstin: string;
  customerStateCode: string;
  customerState: string;
  vehicleNo: string;
  items: IInvoiceItem[];
  useIgst: boolean;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    particulars: { type: String, default: "" },
    hsnCode: { type: String, default: "" },
    uom: { type: String, default: "" },
    qty: { type: String, default: "" },
    rate: { type: String, default: "" },
    total: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    company: {
      type: String,
      enum: ["rehoboth", "kirubai"],
      required: true,
      default: "rehoboth",
      index: true,
    },
    marked: { type: Boolean, default: false, index: true },
    invoiceNo: { type: String, required: true, trim: true, index: true },
    date: { type: String, required: true },
    buyerName: { type: String, default: "" },
    buyerAddress: { type: String, default: "" },
    customerGstin: { type: String, default: "" },
    customerStateCode: { type: String, default: "" },
    customerState: { type: String, default: "" },
    vehicleNo: { type: String, default: "" },
    items: { type: [InvoiceItemSchema], default: [] },
    useIgst: { type: Boolean, default: false },
    taxableValue: { type: Number, required: true, default: 0 },
    cgst: { type: Number, required: true, default: 0 },
    sgst: { type: Number, required: true, default: 0 },
    igst: { type: Number, required: true, default: 0 },
    totalValue: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

export default Invoice;
