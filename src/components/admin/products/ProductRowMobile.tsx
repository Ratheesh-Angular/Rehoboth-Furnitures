"use client";

import { Product } from "@/lib/api/product.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Package } from "lucide-react";

interface ProductRowMobileProps {
  product: Product;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export function ProductRowMobile({
  product,
  onEdit,
  onDelete,
}: ProductRowMobileProps) {
  return (
    <Card className="w-full overflow-visible">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col space-y-4 w-full">
          {/* 1. Product Image - Full Width */}
          <div className="w-full">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 sm:h-56 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 sm:h-56 bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* 2. Product Name - Full Width */}
          <div className="w-full">
            <h3 className="font-semibold text-lg break-words overflow-visible">
              {product.name}
            </h3>
          </div>

          {/* 3. Product Price */}
          <div className="w-full">
            <p className="text-xl font-bold text-primary">
              ₹{product.sellingPrice.toFixed(2)}
            </p>
            {product.beforePrice &&
              product.beforePrice > product.sellingPrice && (
                <p className="text-sm text-muted-foreground line-through mt-1">
                  ₹{product.beforePrice.toFixed(2)}
                </p>
              )}
          </div>

          {/* 4. Product Category - Optional */}
          {product.categoryId && product.categoryId.name && (
            <div className="w-full">
              <p className="text-sm text-muted-foreground break-words overflow-visible">
                <span className="font-medium">Category: </span>
                {product.categoryId.name}
              </p>
            </div>
          )}

          {/* 5. Additional Fields from Desktop Table - Each on its own line */}
          {product.beforePrice &&
            product.beforePrice > product.sellingPrice && (
              <div className="w-full">
                <p className="text-sm text-muted-foreground break-words overflow-visible">
                  <span className="font-medium">Original Price: </span>₹
                  {product.beforePrice.toFixed(2)}
                </p>
              </div>
            )}

          {/* 6. Edit and Delete Icon Buttons - Bottom, Horizontally Aligned, Spaced Apart */}
          <div className="w-full pt-2 border-t">
            <div className="flex justify-between items-center gap-4">
              <Button
                variant="outline"
                onClick={() => onEdit(product._id)}
                aria-label="Edit product"
                className="flex-1"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete(product._id)}
                aria-label="Delete product"
                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
