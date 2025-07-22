import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationFilter } from '@papaya/common/filters/validation.filter';
import { AppModule } from 'apps/papaya/src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Global Authentication Filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ValidationFilter(httpAdapter));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API for managing users')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService = app.get(ConfigService);
  if (!configService.get('auth.jwtSecret')) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

  await app.listen(3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
