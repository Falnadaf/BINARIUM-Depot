import { Schema } from 'mongoose';

export const ProductSchema = new Schema(
  {
    name: { type: String },
    manufacturer: { type: String },
    manufacturing_year: { type: String },
    store: { store_id: { type: String }, store_name: { type: String } },
    generation: { type: String },
    images: [
      {
        _id: false,
        originalname: { type: String },
        mimetype: { type: String },
      },
    ],
    condition: { type: String },
    barcode: { type: String },
  },
  {
    timestamps: true,
  },
);
