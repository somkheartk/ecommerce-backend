import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class OrderItem {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  orderId: ObjectId;

  @Column()
  productId: ObjectId;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
