import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

// ตัวอย่าง user (จริง ๆ ควร query จาก DB)
const mockUser = {
  id: 'u1',
  email: 'test@example.com',
  passwordHash: bcrypt.hashSync('123456', 10), // hash ของ 123456
  name: 'Test User',
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    // 1) หา user จาก DB (ที่นี่ใช้ mock)
    if (email !== mockUser.email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2) ตรวจสอบ password
    const isMatch = await bcrypt.compare(password, mockUser.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3) สร้าง payload
    const payload = { sub: mockUser.id, email: mockUser.email };

    // 4) สร้าง JWT
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'devsecret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return { accessToken };
  }
}
