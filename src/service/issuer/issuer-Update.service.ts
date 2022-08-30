import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Issuer } from '@prisma/client';
import { UpdateDTO } from '../../interface/updateDTO';
import { IssuerRepositoryService } from '../../repository/issuer-repository.service';
import { hash } from 'bcryptjs';

@Injectable()
export class IssuerServiceUpdate {
  constructor(
    @Inject('IssuerRepositoryService')
    private issuerRepositoryService: IssuerRepositoryService,
    @Inject(ConsoleLogger)
    private consoleLogger: ConsoleLogger,
  ) {}

  async execute(issuerId: string, data: UpdateDTO): Promise<Issuer> {
    this.consoleLogger.log(
      `Execute Service IssuerServiceUpdate:: ${issuerId} :: ${JSON.stringify(
        data,
      )}`,
    );
    if (data.password) {
      data.password = await hash(data.password, 8);
    }

    if (data.email) {
      const issuerEmail = await this.issuerRepositoryService.user({
        email: data.email,
      });
      if (issuerEmail) {
        throw new HttpException(
          'Email already registered!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (data.documentNumber) {
      const issuerDocumentNumber = await this.issuerRepositoryService.user({
        documentNumber: data.documentNumber,
      });
      if (issuerDocumentNumber) {
        throw new HttpException(
          'DocumentNumber already registered!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const response = await this.issuerRepositoryService.updateUser({
      where: {
        issuerId,
      },
      data: {
        documentNumber: data.documentNumber,
        email: data.email,
        companyName: data.companyName,
        password: data.password,
      },
    });

    delete response.password;

    return response;
  }
}
