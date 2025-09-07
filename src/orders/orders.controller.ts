import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, Res, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { IOrder } from '../interfaces/order.interface';
import { RESPONSE } from '../constants/app.constants';
import type { Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: Partial<IOrder>, @Res() res: Response) {
    try {
      const order = await this.ordersService.create(body as any);
      return res.status(RESPONSE.CREATED.httpStatus).json({
        code: RESPONSE.CREATED.code,
        message: RESPONSE.CREATED.message,
        data: order,
      });
    } catch (err) {
      return res.status(RESPONSE.FAIL.httpStatus).json({
        code: RESPONSE.FAIL.code,
        message: RESPONSE.FAIL.message,
        error: err.message,
      });
    }
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Res() res: Response
  ) {
    try {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const [orders, total] = await this.ordersService.findAllPaginated(pageNum, limitNum);
      return res.status(RESPONSE.SUCCESS.httpStatus).json({
        code: RESPONSE.SUCCESS.code,
        message: RESPONSE.SUCCESS.message,
        data: orders,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err) {
      return res.status(RESPONSE.FAIL.httpStatus).json({
        code: RESPONSE.FAIL.code,
        message: RESPONSE.FAIL.message,
        error: err.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const order = await this.ordersService.findOne(id);
      return res.status(RESPONSE.SUCCESS.httpStatus).json({
        code: RESPONSE.SUCCESS.code,
        message: RESPONSE.SUCCESS.message,
        data: order,
      });
    } catch (err) {
      return res.status(RESPONSE.ORDER_NOT_FOUND.httpStatus).json({
        code: RESPONSE.ORDER_NOT_FOUND.code,
        message: RESPONSE.ORDER_NOT_FOUND.message,
        error: err.message,
      });
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<IOrder>, @Res() res: Response) {
    try {
      const order = await this.ordersService.update(id, body as any);
      return res.status(RESPONSE.UPDATED.httpStatus).json({
        code: RESPONSE.UPDATED.code,
        message: RESPONSE.UPDATED.message,
        data: order,
      });
    } catch (err) {
      return res.status(RESPONSE.ORDER_NOT_FOUND.httpStatus).json({
        code: RESPONSE.ORDER_NOT_FOUND.code,
        message: RESPONSE.ORDER_NOT_FOUND.message,
        error: err.message,
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.ordersService.remove(id);
      return res.status(RESPONSE.DELETED.httpStatus).json({
        code: RESPONSE.DELETED.code,
        message: RESPONSE.DELETED.message,
      });
    } catch (err) {
      return res.status(RESPONSE.ORDER_NOT_FOUND.httpStatus).json({
        code: RESPONSE.ORDER_NOT_FOUND.code,
        message: RESPONSE.ORDER_NOT_FOUND.message,
        error: err.message,
      });
    }
  }
}
