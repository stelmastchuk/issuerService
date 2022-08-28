import { ConsoleLogger, Module } from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import { AuthServiceCreate } from 'src/service/auth/auth-Create.service';
import { AwsService } from 'src/service/aws/aws-service.service';
import { IssuerModule } from './issuer.module';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'AuthServiceCreate',
      useClass: AuthServiceCreate,
    },
    {
      provide: 'AwsService',
      useClass: AwsService,
    },
    ConsoleLogger,
  ],
  imports: [IssuerModule],
})
export class AuthModule {}
