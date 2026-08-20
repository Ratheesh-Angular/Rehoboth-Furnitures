import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invoice from "@/lib/models/Invoice";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const company = searchParams.get("company");
    const query = (searchParams.get("q") || "").trim().toLowerCase();

    let filter: Record<string, unknown> = {};
    if (company === "rehoboth") {
      // Include old records without company for backward compatibility.
      filter = { $or: [{ company: "rehoboth" }, { company: { $exists: false } }] };
    } else if (company === "kirubai") {
      filter = { company: "kirubai" };
    }

    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "buyerName buyerAddress customerGstin customerStateCode customerState vehicleNo createdAt",
      )
      .lean();

    const customerMap = new Map<
      string,
      {
        buyerName: string;
        buyerAddress: string;
        customerGstin: string;
        customerStateCode: string;
        customerState: string;
        vehicleNo: string;
        lastUsedAt: string;
      }
    >();

    for (const invoice of invoices) {
      const buyerName = String(invoice.buyerName || "").trim();
      if (!buyerName) continue;

      const key = buyerName.toLowerCase();
      if (customerMap.has(key)) continue;

      customerMap.set(key, {
        buyerName,
        buyerAddress: String(invoice.buyerAddress || ""),
        customerGstin: String(invoice.customerGstin || ""),
        customerStateCode: String(invoice.customerStateCode || ""),
        customerState: String(invoice.customerState || ""),
        vehicleNo: String(invoice.vehicleNo || ""),
        lastUsedAt: invoice.createdAt
          ? new Date(invoice.createdAt).toISOString()
          : "",
      });
    }

    let customers = Array.from(customerMap.values());

    if (query) {
      customers = customers.filter(
        (customer) =>
          customer.buyerName.toLowerCase().includes(query) ||
          customer.customerGstin.toLowerCase().includes(query) ||
          customer.vehicleNo.toLowerCase().includes(query),
      );
    }

    return NextResponse.json({ success: true, data: customers });
  } catch (err) {
    console.error("Error fetching customers:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: (err as Error).message,
      },
      { status: 500 },
    );
  }
}
