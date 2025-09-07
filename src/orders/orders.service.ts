// ...existing code...
import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Order } from '../entities/order.entity';
import { IOrder } from '../interfaces/order.interface';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: MongoRepository<Order>,
  ) {}

  async create(data: Partial<Order>): Promise<IOrder> {
    try {
      const order = this.orderRepo.create({ ...data, createdAt: new Date(), status: 'pending' });
      const saved = await this.orderRepo.save(order);
      return this.toIOrder(saved);
    } catch (err) {
      this.logger.error(`Error creating order: ${err.message}`);
      throw new InternalServerErrorException('Database error');
    }
  }

  async findAll(): Promise<IOrder[]> {
    try {
      const orders = await this.orderRepo.find();
      return orders.map(this.toIOrder);
    } catch (err) {
      this.logger.error(`Error finding all orders: ${err.message}`);
      throw new InternalServerErrorException('Database error');
    }
  }

  async findOne(id: string): Promise<IOrder> {
    try {
      const order = await this.orderRepo.findOneBy({ _id: new ObjectId(id) });
      if (!order) throw new NotFoundException('Order not found');
      return this.toIOrder(order);
    } catch (err) {
      this.logger.error(`Error finding order ${id}: ${err.message}`);
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Database error');
    }
  }

  async update(id: string, data: Partial<Order>): Promise<IOrder> {
    try {
      const orderEntity = await this.orderRepo.findOneBy({ _id: new ObjectId(id) });
      if (!orderEntity) throw new NotFoundException('Order not found');
      Object.assign(orderEntity, data);
      const saved = await this.orderRepo.save(orderEntity);
      return this.toIOrder(saved);
    } catch (err) {
      this.logger.error(`Error updating order ${id}: ${err.message}`);
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Database error');
    }
  }


  async remove(id: string): Promise<void> {
    try {
      const result = await this.orderRepo.delete({ _id: new ObjectId(id) });
      if (!result.affected) throw new NotFoundException('Order not found');
    } catch (err) {
      this.logger.error(`Error deleting order ${id}: ${err.message}`);
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Database error');
    }
  }

  async findAllPaginated(page: number, limit: number): Promise<[IOrder[], number]> {
    try {
      const skip = (page - 1) * limit;
      const [orders, total] = await Promise.all([
        this.orderRepo.find({ skip, take: limit }),
        this.orderRepo.count(),
      ]);
      return [orders.map(this.toIOrder), total];
    } catch (err) {
      this.logger.error(`Error paginating orders: ${err.message}`);
      throw new InternalServerErrorException('Database error');
    }
  }

  private toIOrder = (order: Order): IOrder => {
    return {
      _id: order._id?.toString(),
      userId: order.userId?.toString?.() ?? '',
      items: Array.isArray(order.items) ? order.items.map(i => i?.toString?.() ?? i) : [],
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    };
  };
}
