import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RESPONSE } from '../constants/app.constants';
import type { Response } from 'express';
import { buildResponse } from '../common/response.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(dto.email, dto.password);
        return res.status(RESPONSE.OK.httpStatus).json(
          buildResponse({
            code: RESPONSE.OK.code,
            message: RESPONSE.OK.message,
            data: result,
          }),
        );
    } catch (error) {
        return res.status(RESPONSE.UNAUTHORIZED.httpStatus).json(
          buildResponse({
            code: RESPONSE.UNAUTHORIZED.code,
            message: RESPONSE.UNAUTHORIZED.message,
            error: error.message,
          }),
        );
    }
  }
}
