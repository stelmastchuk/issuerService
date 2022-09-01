import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { SecretsManager } from 'aws-sdk';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { InjectAwsService } from 'nest-aws-sdk';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../database/connection/connectionPrisma.service';
import { IssuerRepositoryService } from '../repository/issuer-repository.service';
import { AwsService } from '../service/aws/aws-service.service';

interface IPayLoad {
  sub: string;
}

@Injectable()
export class EnsureAuthMiddleware implements NestMiddleware {
  constructor(
    @InjectAwsService(SecretsManager)
    private readonly secretsManager: SecretsManager,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.info('Execute Service EnsureAuthMiddleware');
    const authHeader = req.headers.authorization;
    const keys = await new AwsService(
      this.secretsManager,
      this.logger,
    ).getSecreKey('SecretBank');

    const issuerRepositoryService = new IssuerRepositoryService(
      this.prismaService,
    );

    if (!authHeader) {
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    }

    const [, token] = authHeader.split(' ');

    try {
      const { sub: issuerId } = verify(token, keys.secretToken) as IPayLoad;

      const user = await issuerRepositoryService.user({ issuerId });

      if (!user) {
        throw new HttpException(
          'User does not exists!',
          HttpStatus.UNAUTHORIZED,
        );
      }

      req.company = {
        id: issuerId,
      };

      next();
    } catch {
      throw new HttpException('Invalid token!', HttpStatus.UNAUTHORIZED);
    }
  }
}
