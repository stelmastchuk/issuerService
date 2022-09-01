import { Body, Controller, Inject, Post, UsePipes } from '@nestjs/common';
import { CreateAuthDTO } from '../interface/createDTO';
import { AuthServiceCreate } from '../service/auth/auth-Create.service';
import { JoiValidationPipe } from '../validator/joiValidation.service';
import { schemaCreateAuthOperation } from '../validator/schema/issuerCreateSchema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthServiceCreate') private authServiceCreate: AuthServiceCreate,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  @UsePipes(new JoiValidationPipe(schemaCreateAuthOperation))
  async createAuthToken(@Body() data: CreateAuthDTO): Promise<object> {
    this.logger.info('Executing Auth Controller');
    return this.authServiceCreate.execute(data);
  }
}
