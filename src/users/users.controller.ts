import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from '../interfaces/user.interface';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

		@Post()
		create(@Body() body: Partial<IUser>): Promise<IUser> {
			return this.usersService.create(body as any);
		}

		@Get()
		findAll(): Promise<IUser[]> {
			return this.usersService.findAll();
		}

		@Get(':id')
		findOne(@Param('id') id: string): Promise<IUser> {
			return this.usersService.findOne(id);
		}

		@Put(':id')
		update(@Param('id') id: string, @Body() body: Partial<IUser>): Promise<IUser> {
			return this.usersService.update(id, body as any);
		}

		@Delete(':id')
		remove(@Param('id') id: string): Promise<void> {
			return this.usersService.remove(id);
		}
}
