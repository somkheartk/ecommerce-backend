import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('products')
export class Product {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  product_name: string;

  @Column('decimal')
  price: number;

  @Column('text')
  description: string;

  @Column('int')
  stock_quantity: number;

  @Column({ nullable: true })
  sku: string;

  @Column()
  createdAt: Date;
}
