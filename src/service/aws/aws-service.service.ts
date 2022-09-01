import { Inject, Injectable } from '@nestjs/common';
import { SecretsManager } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface ISecret {
  secretToken: string;
  secretTime: string;
}

@Injectable()
export class AwsService {
  constructor(
    @InjectAwsService(SecretsManager)
    private readonly secretsManager: SecretsManager,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getSecreKey(secretName: string): Promise<ISecret> {
    this.logger.info(
      `Execute Service AwsServiceSecreteManager:: ${secretName}`,
    );
    try {
      const data = await this.secretsManager
        .getSecretValue({
          SecretId: secretName,
        })
        .promise();
      return JSON.parse(data.SecretString) as ISecret;
    } catch (error) {
      throw new Error(error);
    }
  }
}
