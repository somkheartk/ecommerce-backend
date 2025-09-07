
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, SetMetadata, Req, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { IProduct } from '../interfaces/product.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ROLES, RESPONSE } from '../constants/app.constants';
import type { Response } from 'express';
import { buildResponse } from '../common/response.util';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // Admin only
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [ROLES.ADMIN])
        @Post()
        async create(@Body() body: Partial<IProduct>, @Res() res: Response) {
            try {
                const result = await this.productsService.create(body as any);
                return res.status(RESPONSE.CREATED.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.CREATED.code,
                        message: RESPONSE.CREATED.message,
                        data: result,
                    })
                );
            } catch (error) {
                return res.status(RESPONSE.BAD_REQUEST.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.BAD_REQUEST.code,
                        message: RESPONSE.BAD_REQUEST.message,
                        error: error.message,
                    })
                );
            }
        }

    // User or Admin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [ROLES.USER, ROLES.ADMIN])
        @Get()
        async findAll(@Req() req, @Res() res: Response) {
            try {
                // ตัวอย่าง: ปรับ response ตาม role
                let result;
                if (req.user.role === ROLES.ADMIN) {
                    result = await this.productsService.findAll();
                } else {
                    result = await this.productsService.findAll(); // ปรับ logic ตามต้องการ
                }
                // สมมติว่ามี page, limit, total, totalPages จาก service หรือ query
                const pageNum = req.query?.page ? parseInt(req.query.page, 10) : 1;
                const limitNum = req.query?.limit ? parseInt(req.query.limit, 10) : 10;
                const total = Array.isArray(result) ? result.length : 0;
                const totalPages = Math.ceil(total / limitNum);
                return res.status(RESPONSE.OK.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.OK.code,
                        message: RESPONSE.OK.message,
                        data: result,
                        meta: {
                            ...RESPONSE.OK.meta,
                            page: pageNum,
                            limit: limitNum,
                            total,
                            totalPages,
                        },
                    })
                );
            } catch (error) {
                return res.status(RESPONSE.BAD_REQUEST.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.BAD_REQUEST.code,
                        message: RESPONSE.BAD_REQUEST.message,
                        error: error.message,
                    })
                );
            }
        }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [ROLES.USER, ROLES.ADMIN])
        @Get(':id')
        async findOne(@Param('id') id: string, @Res() res: Response) {
            try {
                const result = await this.productsService.findOne(id);
                return res.status(RESPONSE.OK.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.OK.code,
                        message: RESPONSE.OK.message,
                        data: result,
                    })
                );
            } catch (error) {
                return res.status(RESPONSE.PRODUCT_NOT_FOUND.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.PRODUCT_NOT_FOUND.code,
                        message: RESPONSE.PRODUCT_NOT_FOUND.message,
                        error: error.message,
                    })
                );
            }
        }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [ROLES.ADMIN])
        @Put(':id')
        async update(@Param('id') id: string, @Body() body: Partial<IProduct>, @Res() res: Response) {
            try {
                const result = await this.productsService.update(id, body as any);
                return res.status(RESPONSE.UPDATED.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.UPDATED.code,
                        message: RESPONSE.UPDATED.message,
                        data: result,
                    })
                );
            } catch (error) {
                return res.status(RESPONSE.PRODUCT_NOT_FOUND.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.PRODUCT_NOT_FOUND.code,
                        message: RESPONSE.PRODUCT_NOT_FOUND.message,
                        error: error.message,
                    })
                );
            }
        }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [ROLES.ADMIN])
        @Delete(':id')
        async remove(@Param('id') id: string, @Res() res: Response) {
            try {
                await this.productsService.remove(id);
                return res.status(RESPONSE.DELETED.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.DELETED.code,
                        message: RESPONSE.DELETED.message,
                    })
                );
            } catch (error) {
                return res.status(RESPONSE.PRODUCT_NOT_FOUND.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.PRODUCT_NOT_FOUND.code,
                        message: RESPONSE.PRODUCT_NOT_FOUND.message,
                        error: error.message,
                    })
                );
            }
        }

    // Public: Get all products (no auth)
        @Get('public/all')
        async getAllPublic(@Req() req, @Res() res: Response) {
            try {
                // รับ page, limit จาก query string
                const pageNum = Math.max(1, parseInt(req.query.page, 10) || 1);
                const limitNum = Math.max(1, parseInt(req.query.limit, 10) || 10);
                const { data, total } = await this.productsService.findAllPaginated(pageNum, limitNum);
                const totalPages = Math.ceil(total / limitNum);
                return res.status(RESPONSE.OK.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.OK.code,
                        message: RESPONSE.OK.message,
                        data,
                        meta: {
                            page: pageNum,
                            limit: limitNum,
                            total,
                            totalPages,
                        },
                    })
                );
            } catch (error) {
                return res.status(RESPONSE.BAD_REQUEST.httpStatus).json(
                    buildResponse({
                        code: RESPONSE.BAD_REQUEST.code,
                        message: RESPONSE.BAD_REQUEST.message,
                        error: error.message,
                    })
                );
            }
        }
}
