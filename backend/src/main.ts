import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3002',
    credentials: true,
  });

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Redis adapter for Socket.IO
  const configService = app.get(ConfigService);
  const redisHost = configService.get('REDIS_HOST', 'localhost');
  const redisPort = configService.get('REDIS_PORT', 6379);

  const pubClient = createClient({ url: `redis://${redisHost}:${redisPort}` });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);

  app.useWebSocketAdapter(
    new (class extends IoAdapter {
      createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, options);
        server.adapter(createAdapter(pubClient, subClient));
        return server;
      }
    })(app),
  );

  const port = configService.get('PORT', 3001);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();