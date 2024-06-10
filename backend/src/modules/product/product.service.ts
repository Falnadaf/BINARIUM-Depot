import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './models/product.model';
import mongoose from 'mongoose';
import { Store } from '../store/models/store.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('products') private readonly productModel: Model<Product>,
    @InjectModel('stores') private readonly storeModel: Model<Store>,
  ) {}

  async addProduct(payload: Product, images: any): Promise<Product> {
    if (payload.store) payload.store = JSON.parse(payload.store as any);

    const newProduct = new this.productModel(payload);
    newProduct.images = images.map((image) => ({
      originalname: image.originalname,
      mimetype: image.mimetype,
    }));

    await newProduct.save();
    // Update the StoreModel to include the new product ID in the products array
    await this.storeModel
      .findByIdAndUpdate(
        payload.store.store_id, // Assuming payload.store contains the store ID
        { $push: { products: newProduct._id } },
        { new: true },
      )
      .exec();

    return newProduct;
  }

  async getProduct(searchValue: string): Promise<Product> {
    let query: object;
    if (mongoose.Types.ObjectId.isValid(searchValue)) {
      query = { _id: searchValue };
    } else {
      query = { barcode: searchValue };
    }
    const product = await this.productModel.findOne(query).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getProductByStore(store_id: string): Promise<Product[]> {
    const query = { 'store.store_id': store_id };
    const product = await this.productModel.find(query).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }

  async updateProduct(
    _id: string,
    updatedFields: Partial<Product>,
    images,
  ): Promise<Product> {
    // Filter out empty values from the updatedFields
    const nonEmptyFields = this.filterEmptyValues(updatedFields);

    // Check if there are any non-empty fields to update
    if (Object.keys(nonEmptyFields).length === 0) {
      throw new BadRequestException('No non-empty fields to update');
    }

    // If there are images to add, update the images array using $push
    if (images && images.length > 0) {
      await this.productModel
        .findByIdAndUpdate(_id, { $push: { images: { $each: images } } })
        .exec();
    }

    // Update other fields if needed
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(_id, { $set: nonEmptyFields }, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct;
  }

  // Utility function to filter out empty values from an object
  filterEmptyValues(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
        result[key] = obj[key];
      }
    }
    return result;
  }

  async deleteProduct(_id: string): Promise<boolean> {
    // Retrieve the product information before deletion
    const product = await this.productModel.findById(_id).exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete the product
    const result = await this.productModel.deleteOne({ _id }).exec();
    // If the product was successfully deleted, update the StoreModel
    if (result.deletedCount > 0) {
      await this.storeModel
        .findByIdAndUpdate(
          product.store.store_id, // Assuming product.store contains the store ID
          { $pull: { products: _id } },
          { new: true },
        )
        .exec();
    }

    return result.deletedCount > 0;
  }
}
