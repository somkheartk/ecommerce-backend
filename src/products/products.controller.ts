import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	create(@Body() body: Partial<Product>) {
		return this.productsService.create(body);
	}

	@Get()
	findAll() {
		return this.productsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.productsService.findOne(id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() body: Partial<Product>) {
		return this.productsService.update(id, body);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productsService.remove(id);
	}
}
