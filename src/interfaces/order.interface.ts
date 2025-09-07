export interface IOrder {
  _id?: string;
  userId: string;
  items: string[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: Date;
}
