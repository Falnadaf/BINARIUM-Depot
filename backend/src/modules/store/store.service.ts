import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from './models/store.model';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel('stores') private readonly storeModel: Model<Store>,
  ) {}

  async getStoreById(_id: string): Promise<Store> {
    return this.storeModel.findById(_id).exec();
  }

  async getAllStores(): Promise<Store[]> {
    return this.storeModel.find().exec();
  }

  async addStore(payload: Store): Promise<Store> {
    const newStore = new this.storeModel(payload);
    return newStore.save();
  }

  async deleteStore(_id: string): Promise<boolean> {
    const result = await this.storeModel.deleteOne({ _id }).exec();
    return result.deletedCount > 0;
  }
}
