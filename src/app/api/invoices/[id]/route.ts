import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invoice from "@/lib/models/Invoice";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (err) {
    console.error("Error fetching invoice:", err);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting invoice:", err);
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
