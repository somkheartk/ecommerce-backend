import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Product]),
		JwtModule,
	],
	providers: [ProductsService],
	controllers: [ProductsController],
	exports: [ProductsService],
})
export class ProductsModule {}
