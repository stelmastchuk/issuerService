import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CreateAuthDTO } from '../interface/createDTO';
import { AuthServiceCreate } from '../service/auth/auth-Create.service';
import { JoiValidationPipe } from '../validator/joiValidation.service';
import { schemaCreateAuthOperation } from '../validator/schema/issuerCreateSchema';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    @Inject('AuthServiceCreate') private authServiceCreate: AuthServiceCreate,
  ) {}

  @Post()
  @UsePipes(new JoiValidationPipe(schemaCreateAuthOperation))
  async createAuthToken(@Body() data: CreateAuthDTO): Promise<object> {
    this.logger.log('Post Auth Executing...');
    return this.authServiceCreate.execute(data);
  }
}
