import { Controller, Get, Inject, Res } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Response } from 'express';

@Controller('healthcheck')
export class HealthCheckController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  async healthCheck(@Res() response: Response): Promise<Response> {
    this.logger.info('Executing HelthCheck');
    return response.status(200).send();
  }
}
