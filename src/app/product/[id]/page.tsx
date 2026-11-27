"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/lib/api/product.api";
import ProductMediaModal from "@/components/ProductMediaModal";
import { Truck, ShieldCheck, Award } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [thumbnail, setThumbnail] = useState("");

  const [product, setProduct] = useState<any>(null);
  const [carouselItems, setCarouselItems] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<
    "images" | "videos" | "dimensions"
  >("images");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(productId);
        console.log("Product response:", response);
        // The API returns { success: true, data: product }
        setProduct(response?.data || response);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Create carousel items when product changes
  useEffect(() => {
    if (!product) return;

    const items: { type: string; url: string }[] = [];

    // Add first image
    if (product.images && product.images.length > 0) {
      items.push({ type: "image", url: product.images[0] });
    }

    // Add YouTube thumbnails
    if (product.youtubeVideoLinks && product.youtubeVideoLinks.length > 0) {
      product.youtubeVideoLinks.forEach((link: string) => {
        items.push({ type: "youtube", url: link });
      });
    }

    // Add remaining images
    if (product.images && product.images.length > 1) {
      product.images.slice(1).forEach((img: string) => {
        items.push({ type: "image", url: img });
      });
    }

    // Add dimension image
    if (product.dimensionImage) {
      items.push({ type: "image", url: product.dimensionImage });
    }

    setCarouselItems(items);
    console.log("carouselItems", items); // Add it here instead
  }, [product]);

  // Load YouTube thumbnail when slide changes
  useEffect(() => {
    const loadThumb = async () => {
      if (carouselItems && carouselItems[currentSlide]?.type === "youtube") {
        const thumb = await getYoutubeThumbnail(
          carouselItems[currentSlide].url
        );

        console.log("thumbnail", thumb);
        setThumbnail(thumb);
      }
    };
    loadThumb();
  }, [currentSlide, carouselItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const categorySlug = product.categoryId?.name
    ?.toLowerCase()
    .replace(/\s+/g, "-");

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselItems.length - 1 ? 0 : prev + 1
    );
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Swipe left = next slide
    const isRightSwipe = distance < -50; // Swipe right = previous slide

    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
  };

  const getYoutubeThumbnail = async (url: string): Promise<string> => {
    console.log("Extracting thumbnail from URL:", url);

    let videoId = "";

    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0].split("/")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0].split("/")[0];
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("shorts/")[1]?.split("?")[0].split("/")[0];
    } else {
      videoId = url.split("/").pop()?.split("?")[0] || "";
    }

    const base = `https://img.youtube.com/vi/${videoId}`;

    const candidates = [
      `${base}/maxresdefault.jpg`,
      `${base}/hqdefault.jpg`,
      `${base}/mqdefault.jpg`,
      `${base}/0.jpg`,
    ];

    const findWorkingThumbnail = (urls: string[]): Promise<string> =>
      new Promise((resolve) => {
        let index = 0;

        const checkNext = () => {
          if (index >= urls.length) return resolve(urls[urls.length - 1]);

          const img = new Image();

          img.onload = () => {
            // If width is too small or is black placeholder, skip
            if (img.width <= 120) {
              index++;
              checkNext();
            } else {
              resolve(urls[index]);
            }
          };

          img.onerror = () => {
            index++;
            checkNext();
          };

          img.src = urls[index];
        };

        checkNext();
      });

    const thumbnail = await findWorkingThumbnail(candidates);

    console.log("Final Thumbnail URL:", thumbnail);

    return thumbnail;
  };

  const handleThumbnailClick = () => {
    const currentItem = carouselItems[currentSlide];
    if (currentItem.type === "youtube") {
      setModalInitialTab("videos");
    } else if (currentItem.url === product.dimensionImage) {
      setModalInitialTab("dimensions");
    } else {
      setModalInitialTab("images");
    }
    setIsModalOpen(true);
  };

  const handleImageClick = () => {
    const currentItem = carouselItems[currentSlide];
    if (currentItem.type === "image") {
      if (currentItem.url === product.dimensionImage) {
        setModalInitialTab("dimensions");
      } else {
        setModalInitialTab("images");
      }
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-4">
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
              <span
                onClick={() =>
                  router.push(
                    `/category/${categorySlug}?id=${product.categoryId?._id}`
                  )
                }
                className="hover:text-gray-900 cursor-pointer"
              >
                {product.categoryId?.name}
              </span>
              {/* <span>/</span>
            <span className="font-semibold text-gray-900">{product.name}</span> */}
            </p>
          </nav>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Carousel */}
            <div className="relative">
              <div
                className="aspect-square bg-zinc-100 rounded-lg overflow-hidden shadow-lg"
                onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                onTouchEnd={(e) => {
                  setTouchEnd(e.changedTouches[0].clientX);
                  handleSwipe();
                }}
              >
                {Array.isArray(carouselItems) &&
                carouselItems.length > 0 &&
                carouselItems[currentSlide] &&
                carouselItems[currentSlide].type === "image" ? (
                  <img
                    src={carouselItems[currentSlide].url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onClick={handleImageClick}
                  />
                ) : carouselItems &&
                  carouselItems[currentSlide]?.type === "youtube" ? (
                  <div
                    onClick={handleThumbnailClick}
                    className="relative w-full h-full cursor-pointer group bg-zinc-100"
                  >
                    <img
                      src={thumbnail}
                      alt="YouTube Video"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to hqdefault if maxresdefault fails
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes("maxresdefault")) {
                          const videoId = carouselItems[currentSlide].url
                            .split("/")
                            .pop()
                            ?.split("?")[0];
                          target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }
                      }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center  transition-all">
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg
                          className="w-10 h-10 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Navigation Arrows */}
              {carouselItems && carouselItems.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    // style={{ display: "none" }}
                    onMouseEnter={(e) => {
                      if (window.innerWidth >= 768) {
                        (e.currentTarget as HTMLElement).style.display =
                          "block";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    // style={{ display: "none" }}
                    onMouseEnter={(e) => {
                      if (window.innerWidth >= 768) {
                        (e.currentTarget as HTMLElement).style.display =
                          "block";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                    }}
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {carouselItems && carouselItems.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {carouselItems.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentSlide === index
                          ? "bg-blue-600 w-8"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Product Details */}
            <div className="">
              {/* Product Name */}
              <h1 className="text-1xl md:text-1xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="mb-3">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl md:text-2xl font-bold text-gray-900">
                    ₹{product.sellingPrice.toLocaleString()}
                  </span>
                  {product.beforePrice > product.sellingPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.beforePrice.toLocaleString()}
                      </span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold">
                        {product.offerPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                {product.beforePrice > product.sellingPrice && (
                  <p className="text-green-600 font-semibold mt-2">
                    You save ₹
                    {(
                      product.beforePrice - product.sellingPrice
                    ).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Available Colors
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color: string, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 cursor-pointer transition-colors"
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="mb-0">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Category:</span>{" "}
                  <span
                    onClick={() =>
                      router.push(
                        `/category/${categorySlug}?id=${product.categoryId?._id}`
                      )
                    }
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {product.categoryId?.name}
                  </span>
                </p>
              </div>

              {/* Product Specifications */}
              {product.specifications && (
                <div className="lg:col-span-2 mt-6">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Specifications
                      </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {product.specifications.designs && (
                        <div className="px-6 py-3 flex justify-between items-start">
                          <span className="text-sm text-gray-700 font-bold">
                            Designs
                          </span>
                          <span className="text-sm text-gray-900 text-right ml-4">
                            {product.specifications.designs}
                          </span>
                        </div>
                      )}

                      {product.specifications.material && (
                        <div className="px-6 py-3 flex justify-between items-start">
                          <span className="text-sm text-gray-700 font-bold">
                            Material
                          </span>
                          <span className="text-sm text-gray-900 text-right ml-4">
                            {product.specifications.material}
                          </span>
                        </div>
                      )}

                      {product.specifications.seater && (
                        <div className="px-6 py-3 flex justify-between items-start">
                          <span className="text-sm text-gray-700 font-bold">
                            Seater
                          </span>
                          <span className="text-sm text-gray-900 text-right ml-4">
                            {product.specifications.seater}
                          </span>
                        </div>
                      )}

                      {product.specifications.upholsteryMaterial && (
                        <div className="px-6 py-3 flex justify-between items-start">
                          <span className="text-sm text-gray-700 font-bold">
                            Upholstery Material
                          </span>
                          <span className="text-sm text-gray-900 text-right ml-4">
                            {product.specifications.upholsteryMaterial}
                          </span>
                        </div>
                      )}

                      {product.specifications.legMaterial && (
                        <div className="px-6 py-3 flex justify-between items-start">
                          <span className="text-sm text-gray-700 font-bold">
                            Leg Material
                          </span>
                          <span className="text-sm text-gray-900 text-right ml-4">
                            {product.specifications.legMaterial}
                          </span>
                        </div>
                      )}

                      {product.specifications.dimensions && (
                        <div className="px-6 py-3 flex justify-between items-start">
                          <span className="text-sm text-gray-700 font-bold">
                            Dimensions (inch)
                          </span>
                          <span className="text-sm text-gray-900 text-right ml-4">
                            {product.specifications.dimensions}
                          </span>
                        </div>
                      )}

                      {product.specifications.foam && (
                        <div className="px-6 py-3 flex justify-between items-start">
                          <span className="text-sm text-gray-700 font-bold">
                            Foam
                          </span>
                          <span className="text-sm text-gray-900 text-right ml-4">
                            {product.specifications.foam}
                          </span>
                        </div>
                      )}

                      {product.specifications.armrest && (
                        <div className="px-6 py-3 flex justify-between items-start">
                          <span className="text-sm text-gray-700 font-bold">
                            Armrest
                          </span>
                          <span className="text-sm text-gray-900 text-right ml-4 capitalize">
                            {product.specifications.armrest}
                          </span>
                        </div>
                      )}

                      {product.specifications.shape && (
                        <div className="px-6 py-3 flex justify-between items-start">
                          <span className="text-sm text-gray-700 font-bold">
                            Shape
                          </span>
                          <span className="text-sm text-gray-900 text-right ml-4 capitalize">
                            {product.specifications.shape}
                          </span>
                        </div>
                      )}

                      {product.specifications.note && (
                        <div className="px-6 py-3 bg-gray-50">
                          <p className="text-sm text-gray-700 font-bold mb-2">
                            Note
                          </p>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {product.specifications.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* trust Badges */}
            <div className="mt-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Free Delivery */}
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow h-[80px]">
                <div className="flex-shrink-0">
                  <Truck className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Free Delivery
                  </h4>
                  <p className="text-xs text-gray-600">On all orders</p>
                </div>
              </div>

              {/* 36 Months Warranty */}
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow h-[80px]">
                <div className="flex-shrink-0">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    36 Months Warranty
                  </h4>
                  <p className="text-xs text-gray-600">Extended coverage</p>
                </div>
              </div>

              {/* Premium Quality */}
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow h-[80px]">
                <div className="flex-shrink-0">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Premium Quality
                  </h4>
                  <p className="text-xs text-gray-600">Crafted with care</p>
                </div>
              </div>
            </div>
            {/* Contact Support Section */}
            <div className="mt-6 bg-zinc-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    Any Doubts?
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
                    Talk to our furniture experts
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Consult our in-store associates for any queries regarding
                    furniture.
                  </p>
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="mt-4 sm:mt-5">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-sm sm:text-base">Chat Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductMediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        initialTab={modalInitialTab}
      />
    </>
  );
}
