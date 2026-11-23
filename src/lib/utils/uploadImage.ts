import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import {
  getR2BucketName,
  getR2Client,
  getR2PublicUrl,
} from "@/lib/config/r2";

export type UploadImageResult = {
  secure_url: string;
};

export type UploadImageOptions = {
  contentType?: string;
  filename?: string;
};

function getExtension(filename?: string): string {
  if (!filename) return ".jpg";
  const ext = path.extname(filename).toLowerCase();
  return ext || ".jpg";
}

export const uploadImage = async (
  buffer: Buffer | ArrayBuffer,
  folder = "furniture",
  options: UploadImageOptions = {}
): Promise<UploadImageResult> => {
  const body = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const ext = getExtension(options.filename);
  const key = `${folder.replace(/\/$/, "")}/${randomUUID()}${ext}`;
  const contentType = options.contentType || "image/jpeg";

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return {
    secure_url: `${getR2PublicUrl()}/${key}`,
  };
};
