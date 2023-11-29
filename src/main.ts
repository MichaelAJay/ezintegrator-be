import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyCookie from '@fastify/cookie';
import { getEnvironmentVariable } from './utility';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const FRONTEND_BASE_URL = getEnvironmentVariable('FRONTEND_BASE_URL');
  const corsOrigin = [FRONTEND_BASE_URL];

  const corsOptions: CorsOptions | CorsOptionsDelegate<any> = {
    origin: corsOrigin,
    credentials: true,
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    exposedHeaders: 'Authorization',
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE', 'PATCH'],
  };

  const adapter = new FastifyAdapter();
  adapter.enableCors(corsOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  await app.register(fastifyCookie, {
    secret: getEnvironmentVariable('COOKIE_SIGNATURE_SECRET'),
  });

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('EZI')
    .setDescription('EZI')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080, '0.0.0.0');
}
bootstrap();
