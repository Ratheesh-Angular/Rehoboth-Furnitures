import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { getR2BucketName, getR2Client, getR2PublicUrl } from "@/lib/config/r2";

export interface UploadImageResult {
  secure_url: string;
  key: string;
}

function detectImageType(buffer: Buffer): { contentType: string; ext: string } {
  // PNG: 89 50 4E 47
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { contentType: "image/png", ext: "png" };
  }

  // WebP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { contentType: "image/webp", ext: "webp" };
  }

  // GIF: GIF8
  if (buffer.length >= 4 && buffer.subarray(0, 4).toString("ascii") === "GIF8") {
    return { contentType: "image/gif", ext: "gif" };
  }

  // Default to JPEG
  return { contentType: "image/jpeg", ext: "jpg" };
}

export const uploadImage = async (
  buffer: Buffer | ArrayBuffer,
  folder = "furniture",
  contentTypeOverride?: string
): Promise<UploadImageResult> => {
  const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const detected = detectImageType(buf);
  const contentType = contentTypeOverride || detected.contentType;
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${detected.ext}`;
  const key = cleanFolder ? `${cleanFolder}/${uniqueName}` : uniqueName;

  const client = getR2Client();
  const bucket = getR2BucketName();
  const publicUrl = getR2PublicUrl();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buf,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    secure_url: `${publicUrl}/${key}`,
    key,
  };
};
