import api from "./axios";

export interface BillingItem {
  _id: string;
  productName: string;
  hsnCode: string;
  createdAt: string;
  updatedAt: string;
}

export const getBillingItems = async () => {
  const res = await api.get("/billing-items");
  return res.data as { success: boolean; data: BillingItem[] };
};

export const createBillingItem = async (payload: {
  productName: string;
  hsnCode?: string;
}) => {
  const res = await api.post("/billing-items", payload);
  return res.data as { success: boolean; data: BillingItem };
};

export const updateBillingItem = async (
  id: string,
  payload: { productName: string; hsnCode?: string },
) => {
  const res = await api.put(`/billing-items/${id}`, payload);
  return res.data as { success: boolean; data: BillingItem };
};

export const deleteBillingItem = async (id: string) => {
  const res = await api.delete(`/billing-items/${id}`);
  return res.data as { success: boolean; message: string };
};
