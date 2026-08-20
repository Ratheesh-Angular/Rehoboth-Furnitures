import api from "./axios";

export interface BillingItem {
  _id: string;
  productName: string;
  createdAt: string;
  updatedAt: string;
}

export const getBillingItems = async () => {
  const res = await api.get("/billing-items");
  return res.data as { success: boolean; data: BillingItem[] };
};

export const createBillingItem = async (productName: string) => {
  const res = await api.post("/billing-items", { productName });
  return res.data as { success: boolean; data: BillingItem };
};

export const updateBillingItem = async (id: string, productName: string) => {
  const res = await api.put(`/billing-items/${id}`, { productName });
  return res.data as { success: boolean; data: BillingItem };
};

export const deleteBillingItem = async (id: string) => {
  const res = await api.delete(`/billing-items/${id}`);
  return res.data as { success: boolean; message: string };
};
