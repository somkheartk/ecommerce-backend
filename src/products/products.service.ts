
import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ObjectId } from 'mongodb';
import { IProduct } from '../interfaces/product.interface';

@Injectable()
export class ProductsService {


    async findAllPaginated(page: number, limit: number): Promise<{ data: IProduct[]; total: number }> {
        try {
            const skip = (page - 1) * limit;
            const [products, total] = await Promise.all([
                this.productRepo.find({ skip, take: limit }),
                this.productRepo.count(),
            ]);
            return { data: products.map(this.toIProduct), total };
        } catch (err) {
            this.logger.error(`Error paginating products: ${err.message}`);
            throw new InternalServerErrorException('Database error');
        }
    }
    private readonly logger = new Logger(ProductsService.name);
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: MongoRepository<Product>,
    ) { }

    async create(data: Partial<Product>): Promise<IProduct> {
        const product = this.productRepo.create({ ...data, createdAt: new Date() });
        const saved = await this.productRepo.save(product);
        return this.toIProduct(saved);
    }

    async findAll(): Promise<IProduct[]> {
        try {
            const products = await this.productRepo.find();
            return products.map(this.toIProduct);
        } catch (err) {
            this.logger.error(`Error finding all products: ${err.message}`);
            throw new InternalServerErrorException('Database error');
        }
    }

    async findOne(id: string): Promise<IProduct> {
        const product = await this.productRepo.findOneBy({ _id: new ObjectId(id) });
        if (!product) throw new NotFoundException('Product not found');
        return this.toIProduct(product);
    }

    async update(id: string, data: Partial<Product>): Promise<IProduct> {
        const productEntity = await this.productRepo.findOneBy({ _id: new ObjectId(id) });
        if (!productEntity) throw new NotFoundException('Product not found');
        Object.assign(productEntity, data);
        const saved = await this.productRepo.save(productEntity);
        return this.toIProduct(saved);
    }

    async remove(id: string): Promise<void> {
        const result = await this.productRepo.delete({ _id: new ObjectId(id) });
        if (!result.affected) throw new NotFoundException('Product not found');
    }

    private toIProduct = (product: Product): IProduct => {
        return {
            _id: product._id?.toString(),
            product_name: product.product_name,
            description: product.description,
            price: product.price,
            stock_quantity: product.stock_quantity,
            createdAt: product.createdAt,
        };
    };
}
