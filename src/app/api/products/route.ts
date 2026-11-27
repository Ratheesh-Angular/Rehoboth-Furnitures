import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import { uploadImage } from "@/lib/utils/uploadImage";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const filter = categoryId ? { categoryId } : {};

    const products = await Product.find(filter)
      .populate("categoryId", "name image")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products });
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
    const categoryId = formData.get("categoryId") as string;
    const sellingPrice = formData.get("sellingPrice") as string;
    const beforePrice = formData.get("beforePrice") as string | null;
    const offerPercentage = formData.get("offerPercentage") as string | null;
    const colors = formData.get("colors") as string;
    const youtubeVideoLinks = formData.get("youtubeVideoLinks") as string;
    const productOverview = formData.get("productOverview") as string | null;
    const specifications = formData.get("specifications") as string | null;

    if (!name || !categoryId || !sellingPrice) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, category and selling price are required",
        },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];
    let dimensionImageUrl: string | undefined;

    // Handle multiple product images
    const imageFiles = formData.getAll("images") as File[];
    for (const file of imageFiles) {
      const buffer = await file.arrayBuffer();
      const uploadResult = await uploadImage(buffer, "products");
      imageUrls.push(uploadResult.secure_url);
    }

    // Handle dimension image
    const dimensionFile = formData.get("dimensionImage") as File | null;
    if (dimensionFile) {
      const buffer = await dimensionFile.arrayBuffer();
      const uploadResult = await uploadImage(buffer, "products/dimensions");
      dimensionImageUrl = uploadResult.secure_url;
    }

    const productData: any = {
      name,
      categoryId,
      sellingPrice: Number(sellingPrice),
      images: imageUrls,
      colors: colors ? JSON.parse(colors) : [],
      youtubeVideoLinks: youtubeVideoLinks ? JSON.parse(youtubeVideoLinks) : [],
    };

    if (beforePrice) productData.beforePrice = Number(beforePrice);
    if (offerPercentage) productData.offerPercentage = Number(offerPercentage);
    if (dimensionImageUrl) productData.dimensionImage = dimensionImageUrl;
    if (productOverview) productData.productOverview = productOverview;
    if (specifications) productData.specifications = JSON.parse(specifications);

    const product = await Product.create(productData);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
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
