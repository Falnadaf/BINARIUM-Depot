import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './models/store.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('get-all')
  async getAllStores(): Promise<Store[]> {
    return this.storeService.getAllStores();
  }

  @Get('get')
  async getStoreById(@Query('_id') _id: string): Promise<Store> {
    return this.storeService.getStoreById(_id);
  }

  @Post('add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async addStore(
    @Body() payload: Store,
    @UploadedFile() image: any,
  ): Promise<Store> {
    payload.image = image;
    return this.storeService.addStore(payload);
  }

  @Delete('delete/:_id')
  async deleteStore(@Param('_id') _id: string): Promise<boolean> {
    return this.storeService.deleteStore(_id);
  }
}
