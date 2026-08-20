import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import BillingItem from "@/lib/models/BillingItem";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
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

    const existing = await BillingItem.findOne({
      _id: { $ne: id },
      productName,
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Billing item already exists",
        },
        { status: 400 },
      );
    }

    const updated = await BillingItem.findByIdAndUpdate(
      id,
      { productName },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Billing item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Billing item updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("Error updating billing item:", err);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await BillingItem.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Billing item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Billing item deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting billing item:", err);
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
