import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: MongoRepository<Order>,
  ) {}

  async create(data: Partial<Order>): Promise<Order> {
    const order = this.orderRepo.create({ ...data, createdAt: new Date(), status: 'pending' });
    return this.orderRepo.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ _id: new ObjectId(id) });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, data);
    return this.orderRepo.save(order);
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderRepo.delete({ _id: new ObjectId(id) });
    if (!result.affected) throw new NotFoundException('Order not found');
  }
}
