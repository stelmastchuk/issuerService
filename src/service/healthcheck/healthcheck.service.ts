import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class HealthCheckService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async execute(): Promise<object> {
    this.logger.info(`Execute Service HealthCheckService:: Succesfully`);
    return { status: 'success' };
  }
}
