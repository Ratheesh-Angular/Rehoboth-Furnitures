"use client";

import { useState, useEffect } from "react";
import { createCategory, updateCategory } from "@/lib/api/category.api";
import { toast } from "sonner";

interface CategoryFormProps {
  category?: { id?: string; name: string; image?: string };
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CategoryForm({
  category,
  onSuccess,
  onClose,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(category?.image || "");

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(imageFile);
    } else if (category?.image) {
      setImageUrl(category.image);
    }
  }, [imageFile, category?.image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required");
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (category?.id) {
        await updateCategory(category.id, formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully");
      }

      setName("");
      setImageFile(null);
      setImageUrl("");
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6  w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {category?.id ? "Edit Category" : "Add Category"}
      </h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Image</label>
        <label className="cursor-pointer bg-gray-100 border border-gray-300 p-3 rounded-lg w-full flex items-center justify-center hover:bg-gray-200">
          {imageFile ? imageFile.name : "Choose Image"}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        {imageUrl && (
          <div className="mt-4 flex justify-center">
            <img
              src={imageUrl}
              alt="Preview"
              className="h-48 w-full object-contain rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 cursor-pointer"
        >
          {category?.id ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
