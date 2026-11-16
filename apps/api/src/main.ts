import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

export function configureApp(app: NestExpressApplication) {
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: (config.get<string>('CORS_ORIGINS') ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useBodyParser('json', { limit: '1mb' });
  return app;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: false });
  configureApp(app);
  const config = app.get(ConfigService);

  if (config.get('NODE_ENV') !== 'production') {
    const doc = new DocumentBuilder()
      .setTitle('UniHub API')
      .setDescription('REST API for the UniHub platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, doc));
  }

  app.enableShutdownHooks();
  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
  Logger.log(`UniHub API listening on http://localhost:${port}/api/v1 (docs: /api/docs)`, 'Bootstrap');
}

if (require.main === module) {
  void bootstrap();
}
