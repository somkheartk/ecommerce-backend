import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class CartItem {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  cartId: ObjectId;

  @Column()
  productId: ObjectId;

  @Column()
  quantity: number;
}
