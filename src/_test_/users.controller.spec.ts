import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

const mockUser = { _id: 'id', email: 'a@b.com', passwordHash: 'x', name: 'n', createdAt: new Date() };

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue({ ...mockUser, name: 'updated' }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = { email: 'a@b.com', password: 'x', name: 'n' };
    const result = await controller.create(dto);
    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one user', async () => {
    const result = await controller.findOne('id');
    expect(result).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith('id');
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'updated' };
    const result = await controller.update('id', dto);
    expect(result).toEqual({ ...mockUser, name: 'updated' });
    expect(service.update).toHaveBeenCalledWith('id', dto);
  });

  it('should remove a user', async () => {
    const result = await controller.remove('id');
    expect(result).toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith('id');
  });
});
