import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SecretsManager } from 'aws-sdk';
import { AwsSdkModule } from 'nest-aws-sdk';
import { AuthModule } from './module/auth.module';
import { IssuerModule } from './module/issuer.module';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

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
    WinstonModule.forRoot({
      level: 'info',
      exitOnError: false,
      format: format.json(),
      transports: [
        new transports.File({
          filename: `/home/ec2-user/app`,
        }),
      ],
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
