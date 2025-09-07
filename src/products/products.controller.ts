import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { IProduct } from '../interfaces/product.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ROLES } from '../constants/app.constants';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	// Admin only
	@UseGuards(JwtAuthGuard, RolesGuard)
	@SetMetadata('roles', [ROLES.ADMIN])
			@Post()
			create(@Body() body: Partial<IProduct>): Promise<IProduct> {
				// Cast to Partial<Product> for service compatibility
				return this.productsService.create(body as any);
			}

	// User or Admin
	@UseGuards(JwtAuthGuard, RolesGuard)
	@SetMetadata('roles', [ROLES.USER, ROLES.ADMIN])
	@Get()
		findAll(@Req() req): Promise<IProduct[]> {
			// ตัวอย่าง: ปรับ response ตาม role
			if (req.user.role === ROLES.ADMIN) {
				return this.productsService.findAll();
			}
			// user ปกติอาจเห็นเฉพาะสินค้าบางประเภท (ตัวอย่าง)
			return this.productsService.findAll(); // ปรับ logic ตามต้องการ
		}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@SetMetadata('roles', [ROLES.USER, ROLES.ADMIN])
	@Get(':id')
		findOne(@Param('id') id: string): Promise<IProduct> {
			return this.productsService.findOne(id);
		}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@SetMetadata('roles', [ROLES.ADMIN])
	@Put(':id')
			update(@Param('id') id: string, @Body() body: Partial<IProduct>): Promise<IProduct> {
				// Cast to Partial<Product> for service compatibility
				return this.productsService.update(id, body as any);
			}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@SetMetadata('roles', [ROLES.ADMIN])
	@Delete(':id')
		remove(@Param('id') id: string): Promise<void> {
			return this.productsService.remove(id);
		}
}
