"use client";

import { useState, useEffect } from "react";
import { getCategories, deleteCategory } from "@/lib/api/category.api";
import Modal from "./Modal";
import CategoryForm from "./CategoryForm";
import { toast } from "sonner";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully.");
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category.");
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory({ ...category, id: category._id });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Category List</h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white py-2 px-4 rounded cursor-pointer"
        >
          Add Category
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="border p-4 rounded shadow flex flex-col justify-between"
          >
            <h3 className="font-medium text-lg">{cat.name}</h3>
            {cat.image && (
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-auto my-2 rounded"
              />
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="bg-blue-600 text-white px-2 py-1 rounded cursor-pointer"
                onClick={() => openEditModal(cat)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
                onClick={() => handleDelete(cat._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CategoryForm
          category={editingCategory || undefined}
          onSuccess={fetchCategories}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
