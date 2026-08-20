import api from "./axios";

export interface Product {
  _id: string;
  name: string;
  categoryId: {
    _id: string;
    name: string;
    image?: string;
  };
  sellingPrice: number;
  beforePrice?: number;
  offerPercentage?: number;
  images: string[];
  colors: string[];
  youtubeVideoLinks: string[];
  dimensionImage?: string;
  productOverview?: string;
  specifications?: {
    designs?: string;
    material?: string;
    seater?: string;
    upholsteryMaterial?: string;
    legMaterial?: string;
    dimensions?: string;
    foam?: string;
    armrest?: string;
    shape?: string;
    note?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  categoryId: string;
  sellingPrice: number;
  beforePrice?: number;
  offerPercentage?: number;
  images?: File[];
  dimensionImage?: File;
  colors?: string[];
  youtubeVideoLinks?: string[];
  productOverview?: string;
  specifications?: {
    designs?: string;
    material?: string;
    seater?: string;
    upholsteryMaterial?: string;
    legMaterial?: string;
    dimensions?: string;
    foam?: string;
    armrest?: string;
    shape?: string;
    note?: string;
  };
}

// CREATE PRODUCT

export const createProduct = async (data: CreateProductData) => {
  try {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("categoryId", data.categoryId);
    formData.append("sellingPrice", data.sellingPrice.toString());

    if (data.beforePrice) {
      formData.append("beforePrice", data.beforePrice.toString());
    }

    if (data.offerPercentage) {
      formData.append("offerPercentage", data.offerPercentage.toString());
    }

    if (data.colors && data.colors.length > 0) {
      formData.append("colors", JSON.stringify(data.colors));
    }

    if (data.youtubeVideoLinks && data.youtubeVideoLinks.length > 0) {
      formData.append(
        "youtubeVideoLinks",
        JSON.stringify(data.youtubeVideoLinks)
      );
    }

    if (data.productOverview) {
      formData.append("productOverview", data.productOverview);
    }
    if (data.specifications) {
      formData.append("specifications", JSON.stringify(data.specifications));
    }
    // Append multiple product images
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Append dimension image
    if (data.dimensionImage) {
      formData.append("dimensionImage", data.dimensionImage);
    }

    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// GET ALL PRODUCTS (with optional category filter)
export const getProducts = async (categoryId?: string) => {
  try {
    const params = categoryId ? { categoryId } : {};
    const response = await api.get("/products", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// UPDATE PRODUCT
export const updateProduct = async (
  id: string,
  data: Partial<CreateProductData> & { existingImages?: string[] }
) => {
  try {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.categoryId) formData.append("categoryId", data.categoryId);
    if (data.sellingPrice)
      formData.append("sellingPrice", data.sellingPrice.toString());
    if (data.beforePrice)
      formData.append("beforePrice", data.beforePrice.toString());
    if (data.offerPercentage)
      formData.append("offerPercentage", data.offerPercentage.toString());
    if (data.productOverview)
      formData.append("productOverview", data.productOverview);
    if (data.specifications) {
      formData.append("specifications", JSON.stringify(data.specifications));
    }
    if (data.colors && data.colors.length > 0) {
      formData.append("colors", JSON.stringify(data.colors));
    }

    if (data.youtubeVideoLinks && data.youtubeVideoLinks.length > 0) {
      formData.append(
        "youtubeVideoLinks",
        JSON.stringify(data.youtubeVideoLinks)
      );
    }
    // Add existing images that should be kept
    if (data.existingImages) {
      formData.append("existingImages", JSON.stringify(data.existingImages));
    }

    // Append new product images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Append new dimension image if provided
    if (data.dimensionImage) {
      formData.append("dimensionImage", data.dimensionImage);
    }

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
