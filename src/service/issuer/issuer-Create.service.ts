import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Issuer } from '@prisma/client';
import { CreateDTO } from '../../interface/createDTO';
import { IssuerRepositoryService } from '../../repository/issuer-repository.service';
import { hash } from 'bcryptjs';

@Injectable()
export class IssuerServiceCreate {
  constructor(
    @Inject('IssuerRepositoryService')
    private issuerRepositoryService: IssuerRepositoryService,
    @Inject(ConsoleLogger)
    private consoleLogger: ConsoleLogger,
  ) {}

  async execute(data: CreateDTO): Promise<Issuer> {
    this.consoleLogger.log(
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

    return response;
  }
}
