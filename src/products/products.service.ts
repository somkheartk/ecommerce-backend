import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepo: MongoRepository<Product>,
	) {}

	async create(data: Partial<Product>): Promise<Product> {
		const product = this.productRepo.create({ ...data, createdAt: new Date() });
		return this.productRepo.save(product);
	}

	async findAll(): Promise<Product[]> {
		return this.productRepo.find();
	}

	async findOne(id: string): Promise<Product> {
		const product = await this.productRepo.findOneBy({ _id: new ObjectId(id) });
		if (!product) throw new NotFoundException('Product not found');
		return product;
	}

	async update(id: string, data: Partial<Product>): Promise<Product> {
		const product = await this.findOne(id);
		Object.assign(product, data);
		return this.productRepo.save(product);
	}

	async remove(id: string): Promise<void> {
		const result = await this.productRepo.delete({ _id: new ObjectId(id) });
		if (!result.affected) throw new NotFoundException('Product not found');
	}
}
