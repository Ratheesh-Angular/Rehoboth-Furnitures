import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBillingItem extends Document {
  productName: string;
  createdAt: Date;
  updatedAt: Date;
}

const BillingItemSchema = new Schema<IBillingItem>(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true },
);

const BillingItem: Model<IBillingItem> =
  mongoose.models.BillingItem ||
  mongoose.model<IBillingItem>("BillingItem", BillingItemSchema);

export default BillingItem;
