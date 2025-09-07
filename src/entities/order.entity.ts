import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: ObjectId;

  @Column()
  items: ObjectId[];

  @Column('decimal')
  total: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';

  @Column()
  createdAt: Date;
}
