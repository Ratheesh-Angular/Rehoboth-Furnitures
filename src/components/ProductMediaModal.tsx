"use client";

import { useState, useEffect } from "react";

interface ProductMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  initialTab?: "images" | "videos" | "dimensions";
}

export default function ProductMediaModal({
  isOpen,
  onClose,
  product,
  initialTab = "images",
}: ProductMediaModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update activeTab when initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split("/").pop()?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/10">
      <div className="relative bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-6">
          <button
            onClick={() => setActiveTab("images")}
            className={`px-6 py-3 font-semibold text-sm md:text-base transition-colors ${
              activeTab === "images"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Images
          </button>
          {product.youtubeVideoLinks &&
            product.youtubeVideoLinks.length > 0 && (
              <button
                onClick={() => setActiveTab("videos")}
                className={`px-6 py-3 font-semibold text-sm md:text-base transition-colors ${
                  activeTab === "videos"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Videos
              </button>
            )}
          {product.dimensionImage && (
            <button
              onClick={() => setActiveTab("dimensions")}
              className={`px-6 py-3 font-semibold text-sm md:text-base transition-colors ${
                activeTab === "dimensions"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dimensions
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {/* Images Tab */}
          {activeTab === "images" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center py-8">
                  No images available
                </p>
              )}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {product.youtubeVideoLinks &&
              product.youtubeVideoLinks.length > 0 ? (
                product.youtubeVideoLinks.map((link: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <iframe
                      src={getYoutubeEmbedUrl(link)}
                      title={`Video ${index + 1}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center py-8">
                  No videos available
                </p>
              )}
            </div>
          )}

          {/* Dimensions Tab */}
          {activeTab === "dimensions" && (
            <div className="flex justify-center">
              {product.dimensionImage ? (
                <div className="max-w-4xl w-full bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.dimensionImage}
                    alt="Product Dimensions"
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <p className="text-gray-500 py-8">
                  No dimension image available
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
