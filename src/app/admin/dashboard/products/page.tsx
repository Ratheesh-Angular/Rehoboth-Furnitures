"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { getCategories } from "@/lib/api/category.api";
import { getProducts, deleteProduct, Product } from "@/lib/api/product.api";
import { ProductList } from "@/components/admin/products/ProductList";

interface Category {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data);
        setSelectedCategory(response.data[0]?._id || "");
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (categoryId: string) => {
    try {
      setProductsLoading(true);
      const response = await getProducts(categoryId);
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const response = await deleteProduct(productToDelete);
      if (response.success) {
        toast.success("Product deleted successfully");
        fetchProducts(selectedCategory);
      }
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/admin/dashboard/products/edit/${productId}`);
  };

  const handleAddProduct = () => {
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }
    router.push(`/admin/dashboard/products/add?categoryId=${selectedCategory}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
              Products
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your product inventory
            </p>
          </div>
        </div>

        {/* Category Select */}
        {loading ? (
          <Skeleton className="h-10 w-full max-w-sm" />
        ) : categories.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">No Categories Found</CardTitle>
            <CardDescription className="text-center max-w-sm mb-6">
              Create categories first before adding products. Categories help
              organize your products.
            </CardDescription>
            <Button onClick={() => router.push("/admin/dashboard/category")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Category
            </Button>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full max-w-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Table */}
            {selectedCategory && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Products</CardTitle>
                      <CardDescription>
                        {products.length} product(s) in this category
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleAddProduct}
                      className="cursor-pointer
                    "
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {productsLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No products in this category yet
                      </p>
                    </div>
                  ) : (
                    <ProductList
                      products={products}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
