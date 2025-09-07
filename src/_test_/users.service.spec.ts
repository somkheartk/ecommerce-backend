import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { MongoRepository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: MongoRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((user) => ({ ...user, _id: 'mockid' })),
            find: jest.fn().mockResolvedValue([]),
            findOneBy: jest.fn().mockResolvedValue(null),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<MongoRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { email: 'a@b.com', passwordHash: 'x', name: 'n' };
    const result = await service.create(dto);
    expect(result).toHaveProperty('email', 'a@b.com');
    expect(repo.create).toHaveBeenCalledWith({ ...dto, createdAt: expect.any(Date) });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should find all users', async () => {
    await service.findAll();
    expect(repo.find).toHaveBeenCalled();
  });

  it('should throw if user not found', async () => {
    await expect(service.findOne('notfound')).rejects.toThrow();
  });

  it('should update a user', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce({ _id: 'mockid', email: 'a', passwordHash: 'b', name: 'c', createdAt: new Date() } as any);
    await service.update('mockid', { name: 'new' });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should remove a user', async () => {
    await service.remove('mockid');
    expect(repo.delete).toHaveBeenCalledWith({ _id: expect.anything() });
  });
});
