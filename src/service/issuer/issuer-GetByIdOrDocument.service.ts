import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Issuer } from '@prisma/client';
import { IssuerRepositoryService } from '../../repository/issuer-repository.service';

@Injectable()
export class IssuerServiceGetByIdOrDocument {
  constructor(
    @Inject('IssuerRepositoryService')
    private issuerRepositoryService: IssuerRepositoryService,
    @Inject(ConsoleLogger)
    private consoleLogger: ConsoleLogger,
  ) {}

  async execute(issuerId: string): Promise<Issuer> {
    this.consoleLogger.log(
      `Execute Service IssuerServiceGetByIdOrDocument:: ${issuerId}`,
    );
    const issuer = await this.issuerRepositoryService.user({
      issuerId,
    });

    if (!issuer) {
      throw new HttpException('Issuer Not exists!', HttpStatus.BAD_REQUEST);
    }

    delete issuer.password;

    return issuer;
  }
}
