import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Issuer } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { IssuerRepositoryService } from '../../repository/issuer-repository.service';

@Injectable()
export class IssuerServiceGetByIdOrDocument {
  constructor(
    @Inject('IssuerRepositoryService')
    private issuerRepositoryService: IssuerRepositoryService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async execute(issuerId: string): Promise<Issuer> {
    this.logger.info(
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
