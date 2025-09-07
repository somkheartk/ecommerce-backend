import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders/orders.controller';
import { OrdersService } from '../orders/orders.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { UpdateOrderDto } from '../orders/dto/update-order.dto';

const mockOrder = { _id: 'id', userId: 'u', items: [], total: 100, status: 'pending', createdAt: new Date() };

const mockOrdersService = {
  create: jest.fn().mockResolvedValue(mockOrder),
  findAll: jest.fn().mockResolvedValue([mockOrder]),
  findOne: jest.fn().mockResolvedValue(mockOrder),
  update: jest.fn().mockResolvedValue({ ...mockOrder, total: 200 }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: mockOrdersService },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order', async () => {
    const dto: CreateOrderDto = { userId: 'u', productIds: [], total: 100 };
    const result = await controller.create(dto);
    expect(result).toEqual(mockOrder);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all orders', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockOrder]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one order', async () => {
    const result = await controller.findOne('id');
    expect(result).toEqual(mockOrder);
    expect(service.findOne).toHaveBeenCalledWith('id');
  });

  it('should update an order', async () => {
    const dto: UpdateOrderDto = { total: 200 };
    const result = await controller.update('id', dto);
    expect(result).toEqual({ ...mockOrder, total: 200 });
    expect(service.update).toHaveBeenCalledWith('id', dto);
  });

  it('should remove an order', async () => {
    const result = await controller.remove('id');
    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith('id');
  });
});
