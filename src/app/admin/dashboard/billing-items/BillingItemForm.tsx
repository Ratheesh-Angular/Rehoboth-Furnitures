"use client";

import { useState } from "react";
import { createBillingItem, updateBillingItem } from "@/lib/api/billing-item.api";
import { toast } from "sonner";

interface BillingItemFormProps {
  billingItem?: { id?: string; productName: string };
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function BillingItemForm({
  billingItem,
  onSuccess,
  onClose,
}: BillingItemFormProps) {
  const [productName, setProductName] = useState(billingItem?.productName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      if (billingItem?.id) {
        await updateBillingItem(billingItem.id, productName.trim());
        toast.success("Billing item updated successfully");
      } else {
        await createBillingItem(productName.trim());
        toast.success("Billing item created successfully");
      }

      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {billingItem?.id ? "Edit Billing Item" : "Add Billing Item"}
      </h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Enter product name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 cursor-pointer disabled:opacity-60"
        >
          {billingItem?.id ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
