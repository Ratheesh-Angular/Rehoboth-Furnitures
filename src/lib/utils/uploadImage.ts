import cloudinary from "@/lib/config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

export const uploadImage = async (
  buffer: Buffer | ArrayBuffer,
  folder = "furniture"
) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result!);
      }
    );

    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    streamifier.createReadStream(buf).pipe(uploadStream);
  });
};
