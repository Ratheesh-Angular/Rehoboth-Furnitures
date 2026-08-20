import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BillingItem from "@/lib/models/BillingItem";

export async function GET() {
  try {
    await connectDB();
    const items = await BillingItem.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
  } catch (err) {
    console.error("Error fetching billing items:", err);
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const productName = String(body?.productName || "").trim();

    if (!productName) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required",
        },
        { status: 400 },
      );
    }

    const exists = await BillingItem.findOne({ productName });
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Billing item already exists",
        },
        { status: 400 },
      );
    }

    const item = await BillingItem.create({ productName });
    return NextResponse.json(
      {
        success: true,
        message: "Billing item created successfully",
        data: item,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating billing item:", err);
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
