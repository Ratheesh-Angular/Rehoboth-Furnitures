import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sellingPrice: { type: Number, required: true },
    beforePrice: { type: Number },
    offerPercentage: { type: Number },
    images: [{ type: String }],
    colors: [{ type: String }],
    youtubeVideoLinks: [{ type: String }],
    dimensionImage: { type: String },
    productOverview: { type: String },
    specifications: {
      designs: { type: String },
      material: { type: String },
      seater: { type: String },
      upholsteryMaterial: { type: String },
      legMaterial: { type: String },
      dimensions: { type: String },
      foam: { type: String },
      armrest: { type: String },
      shape: { type: String },
      note: { type: String },
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
