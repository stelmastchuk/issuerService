import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './database/connection/connectionPrisma.service';
import { HttpErrorFilter } from './error/error';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false,
  });
  app.enableCors();
  app.use(helmet());
  app.useGlobalFilters(new HttpErrorFilter());
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(3000, () => {
    console.log('Server is running!');
  });
}
bootstrap();
