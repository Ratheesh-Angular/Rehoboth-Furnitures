"use client";

import { Product } from "@/lib/api/product.api";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { Pencil, Trash2, Package } from "lucide-react";

interface ProductRowDesktopProps {
  product: Product;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export function ProductRowDesktop({
  product,
  onEdit,
  onDelete,
}: ProductRowDesktopProps) {
  return (
    <TableRow>
      <TableCell>
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-12 w-12 object-cover rounded"
          />
        ) : (
          <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>₹{product.sellingPrice.toFixed(2)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(product._id)}
            aria-label="Edit product"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product._id)}
            aria-label="Delete product"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
