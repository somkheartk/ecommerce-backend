import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from './orders/orders.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('MONGO_DB:', process.env.MONGO_DB);
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      database: process.env.MONGO_DB,
      entities: [__dirname + '/../entities/*.entity.{js,ts}'],
      synchronize: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'devsecret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
    AuthModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
  ],
  controllers: [
    AppController,
    AuthController,
  ],
  providers: [
    AppService,
    AuthService,
  ],
  exports: [AuthService,JwtModule], // เผื่อ module อื่นต้องใช้ sign/verify
})
export class AppModule {}
