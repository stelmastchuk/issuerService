import { Controller, Get, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { HealthCheckService } from 'src/service/healthcheck/healthcheck.service';

@Controller('healthcheck')
export class HealthCheckController {
  constructor(
    @Inject('HealthCheckService')
    private healthCheckService: HealthCheckService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  async healthCheck(): Promise<object> {
    this.logger.info('Executing HelthCheck Controller');
    return this.healthCheckService.execute();
  }
}
