export interface IProduct {
  _id?: string;
  product_name: string;
  description: string;
  price: number;
  stock_quantity: number;
  createdAt: Date;
}
