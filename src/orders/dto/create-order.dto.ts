import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsArray()
  productIds: string[];

  @IsNumber()
  total: number;
}
