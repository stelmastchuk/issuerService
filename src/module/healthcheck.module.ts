import { Module } from '@nestjs/common';
import { HealthCheckController } from 'src/controller/healthcheck.controller';

@Module({
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
