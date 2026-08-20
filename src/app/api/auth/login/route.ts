import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        admin: {
          id: admin._id,
          email: admin.email,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
