import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/lib/models/Category";
import { uploadImage } from "@/lib/utils/uploadImage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    console.error(err);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get("name") as string | null;

    // Find existing category
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    let imageUrl = category.image; // default to old image

    // If a new image is uploaded
    const imageFile = formData.get("image") as File | null;
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const uploadResult = await uploadImage(buffer, "categories");
      imageUrl = uploadResult.secure_url;
    }

    // Update the category
    const updated = await Category.findByIdAndUpdate(
      id,
      {
        name: name || category.name,
        image: imageUrl,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error(err);
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
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error(err);
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
