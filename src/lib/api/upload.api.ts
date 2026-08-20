import api from "./axios";

// Get Cloudinary signature from backend
export const getCloudinarySignature = async () => {
  const res = await api.post("/admin/uploads/signature");
  return res.data;
};

// Upload image directly to Cloudinary
export const uploadToCloudinary = async (file: File): Promise<string> => {
  // 1. Get signature from backend
  const { signature, timestamp, api_key, cloud_name, folder } =
    await getCloudinarySignature();

  // 2. Build FormData for Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  // 3. Upload directly to Cloudinary (no backend involved)
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
  const uploadRes = await fetch(cloudinaryUrl, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const uploadData = await uploadRes.json();
  return uploadData.secure_url;
};
