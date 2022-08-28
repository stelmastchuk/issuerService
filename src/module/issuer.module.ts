import {
  ConsoleLogger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { IssuerController } from 'src/controller/issuer.controller';
import { PrismaService } from 'src/database/connection/connectionPrisma.service';
import { EnsureAuthMiddleware } from 'src/middleware/ensureAuth.service';
import { IssuerRepositoryService } from 'src/repository/issuer-repository.service';
import { IssuerServiceCreate } from 'src/service/issuer/issuer-Create.service';
import { IssuerServiceDelete } from 'src/service/issuer/issuer-Delete.service';
import { IssuerServiceGetByIdOrDocument } from 'src/service/issuer/issuer-GetByIdOrDocument.service';
import { IssuerServiceUpdate } from 'src/service/issuer/issuer-update.service';

@Module({
  controllers: [IssuerController],
  providers: [
    {
      provide: 'IssuerRepositoryService',
      useClass: IssuerRepositoryService,
    },
    {
      provide: 'IssuerServiceDelete',
      useClass: IssuerServiceDelete,
    },
    {
      provide: 'IssuerServiceUpdate',
      useClass: IssuerServiceUpdate,
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
