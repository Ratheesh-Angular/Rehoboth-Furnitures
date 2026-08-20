import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/lib/models/Category";
import { uploadImage } from "@/lib/utils/uploadImage";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const categories = await Category.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: categories });
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const name = formData.get("name") as string;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    // Check if category exists
    const exists = await Category.findOne({ name });
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists",
        },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;

    // Handle image upload
    const imageFile = formData.get("image") as File | null;
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const uploadResult = await uploadImage(buffer, "categories");
      imageUrl = uploadResult.secure_url;
    }

    const category = await Category.create({
      name,
      image: imageUrl,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: category,
      },
      { status: 201 }
    );
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
