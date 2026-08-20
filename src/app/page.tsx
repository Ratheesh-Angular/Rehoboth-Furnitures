"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/category.api";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        // Extract categories array from response
        const data = response?.categories || response?.data || response || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: any) => {
    // Create a URL-friendly slug from category name
    const slug = category.name.toLowerCase().replace(/\s+/g, "-");
    // Navigate to products page with category slug
    router.push(`/category/${slug}?id=${category._id}`);
  };

  if (loading) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pt-4  px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600">
            Discover our premium furniture collection
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Category Card Component
function CategoryCard({
  category,
  onClick,
}: {
  category: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={category.image || "/placeholder-category.jpg"}
          alt={category.name}
          className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          style={{ borderRadius: "8px 8px 0 0" }}
        />
      </div>

      {/* Category Name */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 text-left truncate group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
      </div>
    </button>
  );
}
