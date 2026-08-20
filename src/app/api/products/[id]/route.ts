import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import { uploadImage } from "@/lib/utils/uploadImage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    console.log("Fetching product with ID:", id);

    const product = await Product.findById(id).populate(
      "categoryId",
      "name image"
    );

    console.log("Product found:", product);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    console.error("Error fetching product:", err);
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
    const categoryId = formData.get("categoryId") as string | null;
    const sellingPrice = formData.get("sellingPrice") as string | null;
    const beforePrice = formData.get("beforePrice") as string | null;
    const offerPercentage = formData.get("offerPercentage") as string | null;
    const colors = formData.get("colors") as string | null;
    const youtubeVideoLinks = formData.get("youtubeVideoLinks") as
      | string
      | null;
    const productOverview = formData.get("productOverview") as string | null;
    const specifications = formData.get("specifications") as string | null;
    const existingImages = formData.get("existingImages") as string | null;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    let imageUrls = product.images;
    let dimensionImageUrl = product.dimensionImage;

    // If existingImages is provided, use only those
    if (existingImages) {
      imageUrls = JSON.parse(existingImages);
    }

    // If new images are uploaded, add them
    const imageFiles = formData.getAll("images") as File[];
    for (const file of imageFiles) {
      const buffer = await file.arrayBuffer();
      const uploadResult = await uploadImage(buffer, "products");
      imageUrls.push(uploadResult.secure_url);
    }

    // Handle new dimension image
    const dimensionFile = formData.get("dimensionImage") as File | null;
    if (dimensionFile) {
      const buffer = await dimensionFile.arrayBuffer();
      const uploadResult = await uploadImage(buffer, "products/dimensions");
      dimensionImageUrl = uploadResult.secure_url;
    }

    const updateData: any = {
      name: name || product.name,
      categoryId: categoryId || product.categoryId,
      images: imageUrls,
      colors: colors ? JSON.parse(colors) : product.colors,
      youtubeVideoLinks: youtubeVideoLinks
        ? JSON.parse(youtubeVideoLinks)
        : product.youtubeVideoLinks,
    };

    if (sellingPrice) updateData.sellingPrice = Number(sellingPrice);
    if (beforePrice) updateData.beforePrice = Number(beforePrice);
    if (offerPercentage) updateData.offerPercentage = Number(offerPercentage);
    if (dimensionImageUrl) updateData.dimensionImage = dimensionImageUrl;
    if (productOverview) updateData.productOverview = productOverview;
    if (specifications) updateData.specifications = JSON.parse(specifications);

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("categoryId", "name image");

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
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
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
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
