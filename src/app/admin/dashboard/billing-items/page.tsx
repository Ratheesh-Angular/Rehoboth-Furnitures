"use client";

import { useEffect, useState } from "react";
import {
  BillingItem,
  deleteBillingItem,
  getBillingItems,
} from "@/lib/api/billing-item.api";
import { toast } from "sonner";
import Modal from "./Modal";
import BillingItemForm from "./BillingItemForm";

export default function AdminBillingItemsPage() {
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [editingItem, setEditingItem] = useState<BillingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBillingItems = async () => {
    try {
      const res = await getBillingItems();
      setBillingItems(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch billing items");
    }
  };

  useEffect(() => {
    fetchBillingItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this billing item?")) return;
    try {
      await deleteBillingItem(id);
      toast.success("Billing item deleted successfully.");
      fetchBillingItems();
    } catch (err) {
      toast.error("Failed to delete billing item.");
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: BillingItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Billing Items</h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white py-2 px-4 rounded cursor-pointer"
        >
          Add Billing Item
        </button>
      </div>

      <div className="border rounded overflow-x-auto bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-stone-100 border-b">
              <th className="text-left px-4 py-3 w-24">S.No</th>
              <th className="text-left px-4 py-3">Product Name</th>
              <th className="text-left px-4 py-3 w-44">Actions</th>
            </tr>
          </thead>
          <tbody>
            {billingItems.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={3}>
                  No billing items found
                </td>
              </tr>
            ) : (
              billingItems.map((item, index) => (
                <tr key={item._id} className="border-b last:border-0">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{item.productName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                        onClick={() => openEditModal(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <BillingItemForm
          billingItem={
            editingItem
              ? { id: editingItem._id, productName: editingItem.productName }
              : undefined
          }
          onSuccess={fetchBillingItems}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
