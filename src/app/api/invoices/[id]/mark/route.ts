import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Invoice from "@/lib/models/Invoice";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const marked = Boolean(body?.marked);

    const updated = await Invoice.findByIdAndUpdate(
      id,
      { marked },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: "Invoice not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invoice mark updated",
      data: updated,
    });
  } catch (err) {
    console.error("Error updating invoice mark:", err);
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
