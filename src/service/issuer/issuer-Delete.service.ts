import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { IssuerRepositoryService } from 'src/repository/issuer-repository.service';

@Injectable()
export class IssuerServiceDelete {
  constructor(
    @Inject('IssuerRepositoryService')
    private issuerRepositoryService: IssuerRepositoryService,
    @Inject(ConsoleLogger)
    private consoleLogger: ConsoleLogger,
  ) {}

  async execute(issuerId: string): Promise<object> {
    this.consoleLogger.log(`Execute Service IssuerServiceDelete:: ${issuerId}`);
    await this.issuerRepositoryService.deleteUser({
      issuerId,
    });

    return { status: 'success' };
  }
}
