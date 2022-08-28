import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { SecretsManager } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';

interface ISecret {
  secretToken: string;
  secretTime: string;
}

@Injectable()
export class AwsService {
  constructor(
    @InjectAwsService(SecretsManager)
    private readonly secretsManager: SecretsManager,
    @Inject(ConsoleLogger)
    private consoleLogger: ConsoleLogger,
  ) {}

  async getSecreKey(secretName: string): Promise<ISecret> {
    this.consoleLogger.log(
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
