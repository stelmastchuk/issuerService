import {
  ConsoleLogger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { IssuerController } from 'src/controller/issuer.controller';
import { PrismaService } from '../database/connection/connectionPrisma.service';
import { EnsureAuthMiddleware } from '../middleware/ensureAuth.service';
import { IssuerRepositoryService } from '../repository/issuer-repository.service';
import { IssuerServiceCreate } from '../service/issuer/issuer-Create.service';
import { IssuerServiceDelete } from '../service/issuer/issuer-Delete.service';
import { IssuerServiceUpdate } from '../service/issuer/issuer-Update.service';
import { IssuerServiceGetByIdOrDocument } from '../service/issuer/issuer-GetByIdOrDocument.service';

@Module({
  controllers: [IssuerController],
  providers: [
    {
      provide: 'IssuerRepositoryService',
      useClass: IssuerRepositoryService,
    },
    {
      provide: 'IssuerServiceUpdate',
      useClass: IssuerServiceUpdate,
    },
    {
      provide: 'IssuerServiceDelete',
      useClass: IssuerServiceDelete,
    },
    {
      provide: 'IssuerServiceCreate',
      useClass: IssuerServiceCreate,
    },
    {
      provide: 'IssuerServiceGetByIdOrDocument',
      useClass: IssuerServiceGetByIdOrDocument,
    },
    PrismaService,
    ConsoleLogger,
  ],
  exports: [
    {
      provide: 'IssuerRepositoryService',
      useClass: IssuerRepositoryService,
    },
    PrismaService,
  ],
})
export class IssuerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .forRoutes(
        { path: 'issuer', method: RequestMethod.PUT },
        { path: 'issuer', method: RequestMethod.DELETE },
      );
  }
}
