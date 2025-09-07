import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ObjectId } from 'mongodb';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: MongoRepository<User>,
	) {}

	async create(data: Partial<User>): Promise<IUser> {
		const user = this.userRepo.create({ ...data, createdAt: new Date() });
		const saved = await this.userRepo.save(user);
		return this.toIUser(saved);
	}

	async findAll(): Promise<IUser[]> {
		const users = await this.userRepo.find();
		return users.map(this.toIUser);
	}

	async findOne(id: string): Promise<IUser> {
		const user = await this.userRepo.findOneBy({ _id: new ObjectId(id) });
		if (!user) throw new NotFoundException('User not found');
		return this.toIUser(user);
	}

	async update(id: string, data: Partial<User>): Promise<IUser> {
		const userEntity = await this.userRepo.findOneBy({ _id: new ObjectId(id) });
		if (!userEntity) throw new NotFoundException('User not found');
		Object.assign(userEntity, data);
		const saved = await this.userRepo.save(userEntity);
		return this.toIUser(saved);
	}

	async remove(id: string): Promise<void> {
		const result = await this.userRepo.delete({ _id: new ObjectId(id) });
		if (!result.affected) throw new NotFoundException('User not found');
	}

	private toIUser = (user: User): IUser => {
		return {
			_id: user._id?.toString(),
			email: user.email,
			// passwordHash: user.passwordHash, // Do not return passwordHash
			name: user.name,
			role: user.role,
			createdAt: user.createdAt,
		};
	};
}
