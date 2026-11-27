"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getCategories } from "@/lib/api/category.api";
import { getProductById, updateProduct } from "@/lib/api/product.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
interface Category {
  _id: string;
  name: string;
  image?: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [specifications, setSpecifications] = useState({
    designs: "",
    material: "",
    seater: "",
    upholsteryMaterial: "",
    legMaterial: "",
    dimensions: "",
    foam: "",
    armrest: "",
    shape: "",
    note: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    sellingPrice: "",
    beforePrice: "",
    offerPercentage: "",
    productOverview: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [dimensionImage, setDimensionImage] = useState<File | null>(null);
  const [dimensionPreview, setDimensionPreview] = useState<string>("");
  const [existingDimensionImage, setExistingDimensionImage] =
    useState<string>("");
  const [colors, setColors] = useState<string[]>([""]);
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([""]);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleSpecificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSpecifications((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProduct = async () => {
    try {
      setPageLoading(true);
      const response = await getProductById(productId);
      if (response.success) {
        const product = response.data;
        setFormData({
          name: product.name,
          categoryId: product.categoryId._id,
          sellingPrice: product.sellingPrice.toString(),
          beforePrice: product.beforePrice?.toString() || "",
          offerPercentage: product.offerPercentage?.toString() || "",
          productOverview: product.productOverview || "",
        });
        setExistingImages(product.images || []);
        setExistingDimensionImage(product.dimensionImage || "");
        setColors(product.colors.length > 0 ? product.colors : [""]);
        setYoutubeLinks(
          product.youtubeVideoLinks.length > 0
            ? product.youtubeVideoLinks
            : [""]
        );
        // Add specifications data
        if (product.specifications) {
          setSpecifications(product.specifications);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch product details");
      router.push("/admin/dashboard/products");
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate offer percentage when selling price or before price changes
      if (name === "sellingPrice" || name === "beforePrice") {
        const sellingPrice =
          name === "sellingPrice" ? Number(value) : Number(prev.sellingPrice);
        const beforePrice =
          name === "beforePrice" ? Number(value) : Number(prev.beforePrice);

        if (sellingPrice > 0 && beforePrice > 0 && beforePrice > sellingPrice) {
          const discount = ((beforePrice - sellingPrice) / beforePrice) * 100;
          updated.offerPercentage = Math.round(discount).toString();
        } else {
          updated.offerPercentage = "";
        }
      }

      return updated;
    });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages((prev) => [...prev, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDimensionImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setDimensionImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDimensionPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setExistingDimensionImage(""); // Clear existing image when new one is selected
    }
  };

  const addColorField = () => {
    setColors((prev) => [...prev, ""]);
  };

  const removeColorField = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, value: string) => {
    setColors((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addYoutubeLinkField = () => {
    setYoutubeLinks((prev) => [...prev, ""]);
  };

  const removeYoutubeLinkField = (index: number) => {
    setYoutubeLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateYoutubeLink = (index: number, value: string) => {
    setYoutubeLinks((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // If user removed some existing images, send the remaining ones

    if (!formData.name || !formData.categoryId || !formData.sellingPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const productData: any = {
        name: formData.name,
        categoryId: formData.categoryId,
        sellingPrice: Number(formData.sellingPrice),
        beforePrice: formData.beforePrice
          ? Number(formData.beforePrice)
          : undefined,
        offerPercentage: formData.offerPercentage
          ? Number(formData.offerPercentage)
          : undefined,
        productOverview: formData.productOverview || undefined,
        colors: colors.filter((c) => c.trim() !== ""),
        youtubeVideoLinks: youtubeLinks.filter((l) => l.trim() !== ""),
        existingImages: existingImages,
        specifications: specifications,
      };

      // Only include images if new ones are uploaded
      if (images.length > 0) {
        productData.images = images;
      }

      // Only include dimension image if new one is uploaded
      if (dimensionImage) {
        productData.dimensionImage = dimensionImage;
      }
      // If existing dimension image was removed and no new one added
      if (!existingDimensionImage && !dimensionImage) {
        productData.removeDimensionImage = true; // Add this to signal removal
      }

      const response = await updateProduct(productId, productData);

      if (response.success) {
        toast.success("Product updated successfully");
        router.push("/admin/dashboard/products");
      }
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto py-8 px-2">
        <div className="flex flex-col space-y-6 max-w-8xl ">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                Edit Product
              </h1>
              <p className="text-muted-foreground mt-2">
                Update product information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Enter the basic details of the product
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4 w-full">
                      <Label htmlFor="categoryId">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: value,
                          }))
                        }
                      >
                        <SelectTrigger>
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
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Product Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productOverview">Product Overview</Label>
                      <Textarea
                        id="productOverview"
                        name="productOverview"
                        value={formData.productOverview}
                        onChange={handleInputChange}
                        placeholder="Enter product description"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>Set the pricing details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">
                        Selling Price{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="sellingPrice"
                        name="sellingPrice"
                        type="number"
                        value={formData.sellingPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="beforePrice">Before Price</Label>
                      <Input
                        id="beforePrice"
                        name="beforePrice"
                        type="number"
                        value={formData.beforePrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="offerPercentage">Offer Percentage</Label>
                      <Input
                        id="offerPercentage"
                        name="offerPercentage"
                        type="number"
                        value={formData.offerPercentage}
                        onChange={handleInputChange}
                        placeholder="0"
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Product Images */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Upload multiple images of the product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div>
                      <Label>Current Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {existingImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Existing ${index + 1}`}
                              className="h-32 w-full object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 "
                              onClick={() => removeExistingImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="images">Upload New Images</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("images")?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Images
                      </Button>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImagesChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`New preview ${index + 1}`}
                            className="h-32 w-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Dimension Image */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Dimension Image</CardTitle>
                  <CardDescription>
                    Upload dimension specifications image
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(existingDimensionImage || dimensionPreview) && (
                    <div className="relative w-full max-w-md">
                      <img
                        src={dimensionPreview || existingDimensionImage}
                        alt="Dimension"
                        className="w-full rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => {
                          setDimensionImage(null);
                          setDimensionPreview("");
                          setExistingDimensionImage("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="dimensionImage">
                      {existingDimensionImage
                        ? "Replace Dimension Image"
                        : "Upload Dimension Image"}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("dimensionImage")?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Dimension Image
                      </Button>
                      <Input
                        id="dimensionImage"
                        type="file"
                        accept="image/*"
                        onChange={handleDimensionImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Colors</CardTitle>
                  <CardDescription>
                    Add color options for this product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {colors.map((color, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        placeholder="e.g., Red, Blue, #FF0000"
                      />
                      {colors.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColorField(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addColorField}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Color
                  </Button>
                </CardContent>
              </Card>
              {/* YouTube Links */}
              <Card>
                <CardHeader>
                  <CardTitle>YouTube Video Links</CardTitle>
                  <CardDescription>
                    Add YouTube video URLs for this product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {youtubeLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={link}
                        onChange={(e) =>
                          updateYoutubeLink(index, e.target.value)
                        }
                        placeholder="https://youtube.com/watch?v=..."
                      />
                      {youtubeLinks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeYoutubeLinkField(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addYoutubeLinkField}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add YouTube Link
                  </Button>
                </CardContent>
              </Card>
              {/* Specifications */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                  <CardDescription>
                    Add detailed specifications for this product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="designs">Designs</Label>
                      <Input
                        id="designs"
                        name="designs"
                        value={specifications.designs}
                        onChange={handleSpecificationChange}
                        placeholder="Enter design type"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        name="material"
                        value={specifications.material}
                        onChange={handleSpecificationChange}
                        placeholder="Enter material"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seater">Seater</Label>
                      <Input
                        id="seater"
                        name="seater"
                        value={specifications.seater}
                        onChange={handleSpecificationChange}
                        placeholder="e.g., 3 Seater"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upholsteryMaterial">
                        Upholstery Material
                      </Label>
                      <Input
                        id="upholsteryMaterial"
                        name="upholsteryMaterial"
                        value={specifications.upholsteryMaterial}
                        onChange={handleSpecificationChange}
                        placeholder="Enter upholstery material"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="legMaterial">Leg Material</Label>
                      <Input
                        id="legMaterial"
                        name="legMaterial"
                        value={specifications.legMaterial}
                        onChange={handleSpecificationChange}
                        placeholder="Enter leg material"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions (inches)</Label>
                      <Input
                        id="dimensions"
                        name="dimensions"
                        value={specifications.dimensions}
                        onChange={handleSpecificationChange}
                        placeholder="e.g., 72x36x32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="foam">Foam</Label>
                      <Input
                        id="foam"
                        name="foam"
                        value={specifications.foam}
                        onChange={handleSpecificationChange}
                        placeholder="Enter foam type"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="armrest">Armrest</Label>
                      <Select
                        value={specifications.armrest}
                        onValueChange={(value) =>
                          setSpecifications((prev) => ({
                            ...prev,
                            armrest: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select armrest option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shape">Shape</Label>
                      <Select
                        value={specifications.shape}
                        onValueChange={(value) =>
                          setSpecifications((prev) => ({
                            ...prev,
                            shape: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round">Round</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="rectangle">Rectangle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Note</Label>
                    <Textarea
                      id="note"
                      name="note"
                      value={specifications.note}
                      onChange={handleSpecificationChange}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
              {/* Submit Buttons */}
              <div className="lg:col-span-2 flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Suspense>
  );
}
