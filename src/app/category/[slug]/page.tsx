"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { getProducts } from "@/lib/api/product.api";
export default function CategoryProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const categoryId = searchParams.get("id");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const name = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        setCategoryName(name);

        // Call getProducts API with categoryId filter
        const response = await getProducts(categoryId || undefined);
        const productsData =
          response?.products || response?.data || response || [];

        // Map the API response to match our component structure
        const formattedProducts = productsData.map((product: any) => ({
          id: product._id,
          name: product.name,
          image: product.images?.[0] || "/placeholder-product.jpg",
          sellingPrice: product.sellingPrice,
          originalPrice: product.beforePrice || product.sellingPrice,
          offerPercentage: product.offerPercentage || 0,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId, slug]);

  const handleProductClick = (productId: string) => {
    // Navigate to product detail page
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span
              onClick={() => router.push("/")}
              className="hover:text-gray-900 cursor-pointer"
            >
              Home
            </span>
            <span>/</span>
            <span className="font-semibold text-gray-900">{categoryName}</span>
          </p>
        </nav>

        {/* Category Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} products found
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  onClick,
}: {
  product: any;
  onClick: () => void;
}) {
  useEffect(() => {
    console.log("Product data:", product);
  }, [product]);
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image && (
          <>
            <img
              src={product?.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </>
        )}

        {/* Offer Badge */}
        {product.offerPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-white text-green-600 !text-green-600 text-xs font-semibold px-2 py-1 rounded shadow">
            {product.offerPercentage}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Selling Price */}
          <span className="text-lg font-bold text-gray-900">
            ₹{product.sellingPrice.toLocaleString()}
          </span>

          {/* Original Price */}
          {product.originalPrice > product.sellingPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Savings Text */}
        {product.originalPrice > product.sellingPrice && (
          <p className="text-xs text-green-600 font-medium mt-1">
            Save ₹
            {(product.originalPrice - product.sellingPrice).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
