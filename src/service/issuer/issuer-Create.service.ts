import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Issuer } from '@prisma/client';
import { CreateDTO } from '../../interface/createDTO';
import { IssuerRepositoryService } from '../../repository/issuer-repository.service';
import { hash } from 'bcryptjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class IssuerServiceCreate {
  constructor(
    @Inject('IssuerRepositoryService')
    private issuerRepositoryService: IssuerRepositoryService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async execute(data: CreateDTO): Promise<Issuer> {
    this.logger.info(
      `Execute Service IssuerServiceCreate:: ${JSON.stringify(data)}`,
    );

    const issuerDocumentNumber = await this.issuerRepositoryService.user({
      documentNumber: data.documentNumber,
    });

    const issuerEmail = await this.issuerRepositoryService.user({
      email: data.email,
    });

    if (issuerDocumentNumber || issuerEmail) {
      throw new HttpException('Issuer Already exists!', HttpStatus.BAD_REQUEST);
    }

    data.password = await hash(data.password, 8);

    const response = await this.issuerRepositoryService.createUser(data);

    delete response.password;

    this.logger.info(`Execute Service IssuerServiceCreate:: Succesfully`);

    return response;
  }
}
