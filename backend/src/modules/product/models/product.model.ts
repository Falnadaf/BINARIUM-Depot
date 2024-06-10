export class Product {
  _id?: string;
  name?: string;
  manufacturer?: string;
  manufacturing_year?: string;
  store?: { store_id: string; store_name: string };
  generation?: string;
  images?: [{ originalname: string; mimetype: string }];
  barcode?: string;
  condition?: string;
}
