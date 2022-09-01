import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { IssuerRepositoryService } from '../../repository/issuer-repository.service';

@Injectable()
export class IssuerServiceDelete {
  constructor(
    @Inject('IssuerRepositoryService')
    private issuerRepositoryService: IssuerRepositoryService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async execute(issuerId: string): Promise<object> {
    this.logger.info(`Execute Service IssuerServiceDelete:: ${issuerId}`);
    await this.issuerRepositoryService.deleteUser({
      issuerId,
    });

    return { status: 'success' };
  }
}
