import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './models/product.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  addProduct(
    @Body() payload: Product,
    @UploadedFiles() images: any,
  ): Promise<Product> {
    return this.productService.addProduct(payload, images);
  }

  @Get('get')
  getProduct(@Query('searchValue') searchValue: string): Promise<Product> {
    return this.productService.getProduct(searchValue);
  }

  @Get('store')
  getProductByStore(@Query('store_id') store_id: string): Promise<Product[]> {
    return this.productService.getProductByStore(store_id);
  }

  @Get('get-all')
  getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Put('update/:_id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  updateProduct(
    @Param('_id') _id: string,
    @Body() payload: Product,
    @UploadedFiles() images: any,
  ): Promise<Product> {
    return this.productService.updateProduct(_id, payload, images);
  }

  @Delete('delete/:_id')
  deleteProduct(@Param('_id') _id: string): Promise<boolean> {
    return this.productService.deleteProduct(_id);
  }
}
