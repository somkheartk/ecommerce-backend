import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders/orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { MongoRepository } from 'typeorm';

describe('OrdersService', () => {
  let service: OrdersService;
  let repo: MongoRepository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((order) => ({ ...order, _id: 'mockid' })),
            find: jest.fn().mockResolvedValue([]),
            findOneBy: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repo = module.get<MongoRepository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    const dto = { userId: 'u', items: [], total: 100 };
    const result = await service.create(dto);
    expect(result).toHaveProperty('userId', 'u');
    expect(repo.create).toHaveBeenCalledWith({ ...dto, createdAt: expect.any(Date), status: 'pending' });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should find all orders', async () => {
    await service.findAll();
    expect(repo.find).toHaveBeenCalled();
  });

  it('should throw if order not found', async () => {
    await expect(service.findOne('notfound')).rejects.toThrow();
  });

  it('should update an order', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce({ _id: 'mockid', userId: 'u', items: [], total: 100, status: 'pending', createdAt: new Date() } as any);
    await service.update('mockid', { total: 200 });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should remove an order', async () => {
    await service.remove('mockid');
    expect(repo.delete).toHaveBeenCalledWith({ _id: expect.anything() });
  });
});
