import { Module } from '@nestjs/common';
import { HealthCheckController } from 'src/controller/healthcheck.controller';
import { HealthCheckService } from 'src/service/healthcheck/healthcheck.service';

@Module({
  controllers: [HealthCheckController],
  providers: [
    {
      provide: 'HealthCheckService',
      useClass: HealthCheckService,
    },
  ],
})
export class HealthCheckModule {}
