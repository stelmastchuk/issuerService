import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { SecretsManager } from 'aws-sdk';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { InjectAwsService } from 'nest-aws-sdk';
import { PrismaService } from 'src/database/connection/connectionPrisma.service';
import { IssuerRepositoryService } from 'src/repository/issuer-repository.service';
import { AwsService } from 'src/service/aws/aws-service.service';

interface IPayLoad {
  sub: string;
}

@Injectable()
export class EnsureAuthMiddleware implements NestMiddleware {
  constructor(
    @InjectAwsService(SecretsManager)
    private readonly secretsManager: SecretsManager,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const consoleLogger = new ConsoleLogger();
    consoleLogger.log('Execute Service EnsureAuthMiddleware');
    const authHeader = req.headers.authorization;
    const keys = await new AwsService(
      this.secretsManager,
      consoleLogger,
    ).getSecreKey('SecretBank');
    const prisma = new PrismaService();
    const issuerRepositoryService = new IssuerRepositoryService(prisma);

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
    } finally {
      prisma.$disconnect();
    }
  }
}
