import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SecretsManager } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AuthModule } from './module/auth.module';
import { IssuerModule } from './module/issuer.module';

@Module({
  imports: [
    IssuerModule,
    AuthModule,
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useValue: {
          region: 'us-east-2',
        },
      },
      services: [SecretsManager],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
