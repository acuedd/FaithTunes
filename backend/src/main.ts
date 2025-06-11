import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { UsersService } from './users/users.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Music App API')
    .setDescription('API para carga, gestión y reproducción de música')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const usersService = app.get(UsersService);
  const adminEmail = 'admin@example.com';
  const adminExists = await usersService.findByEmail(adminEmail);
  if (!adminExists) {
    await usersService.create({
      name: 'Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
    });
  }

  await app.listen(3000);
}
bootstrap();