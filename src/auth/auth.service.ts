import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    // 1) หา user จาก DB
    const users = await this.usersService.findAll();
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2) ตรวจสอบ password
    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

  // 3) สร้าง payload
  const payload = { sub: user._id?.toString?.() ?? '', email: user.email, role: user.role };

    // 4) สร้าง JWT
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'devsecret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return { accessToken };
  }
}
