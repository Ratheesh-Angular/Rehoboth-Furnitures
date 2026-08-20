import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invoice from "@/lib/models/Invoice";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const company = searchParams.get("company");

    let filter = {};
    if (company === "rehoboth") {
      // Include old records without company for backward compatibility.
      filter = { $or: [{ company: "rehoboth" }, { company: { $exists: false } }] };
    } else if (company === "kirubai") {
      filter = { company: "kirubai" };
    }

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: invoices });
  } catch (err) {
    console.error("Error fetching invoices:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body?.invoiceNo || !body?.date) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice number and date are required",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items)) {
      return NextResponse.json(
        {
          success: false,
          message: "Items must be an array",
        },
        { status: 400 }
      );
    }

    const company = body?.company === "kirubai" ? "kirubai" : "rehoboth";

    const invoice = await Invoice.create({
      company,
      invoiceNo: String(body.invoiceNo).trim(),
      date: String(body.date),
      buyerName: body.buyerName || "",
      buyerAddress: body.buyerAddress || "",
      customerGstin: body.customerGstin || "",
      customerStateCode: body.customerStateCode || "",
      customerState: body.customerState || "",
      vehicleNo: body.vehicleNo || "",
      items: body.items,
      useIgst: Boolean(body.useIgst),
      taxableValue: Number(body.taxableValue) || 0,
      cgst: Number(body.cgst) || 0,
      sgst: Number(body.sgst) || 0,
      igst: Number(body.igst) || 0,
      totalValue: Number(body.totalValue) || 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invoice saved successfully",
        data: invoice,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error saving invoice:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
