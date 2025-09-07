import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products/products.controller';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';

const mockProduct = { _id: 'id', name: 'n', description: 'd', price: 1, stock: 1, createdAt: new Date() };

const mockProductsService = {
  create: jest.fn().mockResolvedValue(mockProduct),
  findAll: jest.fn().mockResolvedValue([mockProduct]),
  findOne: jest.fn().mockResolvedValue(mockProduct),
  update: jest.fn().mockResolvedValue({ ...mockProduct, name: 'updated' }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = { name: 'n', description: 'd', price: 1, stock: 1 };
    const result = await controller.create(dto);
    expect(result).toEqual(mockProduct);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all products', async () => {
    const result = await controller.findAll({ user: { role: 'admin' } });
    expect(result).toEqual([mockProduct]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one product', async () => {
    const result = await controller.findOne('id');
    expect(result).toEqual(mockProduct);
    expect(service.findOne).toHaveBeenCalledWith('id');
  });

  it('should update a product', async () => {
    const dto: UpdateProductDto = { name: 'updated' };
    const result = await controller.update('id', dto);
    expect(result).toEqual({ ...mockProduct, name: 'updated' });
    expect(service.update).toHaveBeenCalledWith('id', dto);
  });

  it('should remove a product', async () => {
    const result = await controller.remove('id');
    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith('id');
  });
});
