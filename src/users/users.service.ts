import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: MongoRepository<User>,
	) {}

	async create(data: Partial<User>): Promise<User> {
		const user = this.userRepo.create({ ...data, createdAt: new Date() });
		return this.userRepo.save(user);
	}

	async findAll(): Promise<User[]> {
		return this.userRepo.find();
	}

	async findOne(id: string): Promise<User> {
		const user = await this.userRepo.findOneBy({ _id: new ObjectId(id) });
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async update(id: string, data: Partial<User>): Promise<User> {
		const user = await this.findOne(id);
		Object.assign(user, data);
		return this.userRepo.save(user);
	}

	async remove(id: string): Promise<void> {
		const result = await this.userRepo.delete({ _id: new ObjectId(id) });
		if (!result.affected) throw new NotFoundException('User not found');
	}
}
