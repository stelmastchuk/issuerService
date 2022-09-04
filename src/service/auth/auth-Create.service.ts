import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDTO } from '../../interface/createDTO';
import { IssuerRepositoryService } from '../../repository/issuer-repository.service';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { AwsService } from '../aws/aws-service.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthServiceCreate {
  constructor(
    @Inject('IssuerRepositoryService')
    private issuerRepositoryService: IssuerRepositoryService,
    @Inject('AwsService')
    private awsService: AwsService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async execute(data: CreateAuthDTO): Promise<object> {
    this.logger.info(
      `Execute Service AuthServiceCreate:: ${JSON.stringify(data)}`,
    );

    const keys = await this.awsService.getSecreKey('SecretBank');
    const issuer = await this.issuerRepositoryService.user({
      email: data.email,
    });

    if (!issuer) {
      throw new HttpException(
        'Email or Password incorret!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatch = await compare(data.password, issuer.password);

    if (!passwordMatch) {
      throw new HttpException(
        'Email or Password incorret!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = sign({}, keys.secretToken, {
      subject: issuer.issuerId,
      expiresIn: keys.secretTime,
    });

    this.logger.info(`Execute Service AuthServiceCreate:: Succesfully`);

    return {
      token,
      Company: {
        name: issuer.companyName,
        email: issuer.email,
      },
    };
  }
}
