import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Print config values on app start
  console.log('--- App Config ---');
  console.log('MONGO_URI:', process.env.MONGO_URI);
  console.log('MONGO_DB:', process.env.MONGO_DB);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('PORT:', process.env.PORT ?? 3000);
  console.log('------------------');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
