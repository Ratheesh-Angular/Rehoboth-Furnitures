"use client";

import { Product } from "@/lib/api/product.api";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductRowDesktop } from "./ProductRowDesktop";
import { ProductRowMobile } from "./ProductRowMobile";

interface ProductListProps {
  products: Product[];
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  return (
    <>
      {/* Desktop Table View - Hidden on mobile, visible on md and up */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <ProductRowDesktop
                key={product._id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View - Visible on mobile, hidden on md and up */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <ProductRowMobile
            key={product._id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}
