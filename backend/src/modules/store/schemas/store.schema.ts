import { Schema } from 'mongoose';

export const StoreSchema = new Schema(
  {
    store_name: { type: String },
    image: { type: { _id: false, originalname: String, mimetype: String } },
    products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
  },
  {
    timestamps: true,
  },
);
