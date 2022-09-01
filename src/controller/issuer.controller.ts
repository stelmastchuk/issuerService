import {
  Param,
  Controller,
  Delete,
  Get,
  Post,
  Inject,
  Body,
  Req,
  ParseUUIDPipe,
  UsePipes,
  Put,
} from '@nestjs/common';
import { Issuer } from '@prisma/client';
import { IssuerServiceCreate } from '../service/issuer/issuer-Create.service';
import { CreatePassDTO } from '../interface/createDTO';
import { IssuerServiceGetByIdOrDocument } from '../service/issuer/issuer-GetByIdOrDocument.service';
import { IssuerServiceDelete } from '../service/issuer/issuer-Delete.service';
import { IssuerServiceUpdate } from '../service/issuer/issuer-Update.service';
import { Request } from 'express';
import { JoiValidationPipe } from '../validator/joiValidation.service';
import {
  schemaCreateOperation,
  schemaUpdatedOperation,
} from 'src/validator/schema/issuerCreateSchema';
import { UpdateDPassDTO } from 'src/interface/updateDTO';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('issuer')
export class IssuerController {
  constructor(
    @Inject('IssuerServiceCreate')
    private issuerServiceCreate: IssuerServiceCreate,
    @Inject('IssuerServiceUpdate')
    private issuerServiceUpdate: IssuerServiceUpdate,
    @Inject('IssuerServiceDelete')
    private issuerServiceDelete: IssuerServiceDelete,
    @Inject('IssuerServiceGetByIdOrDocument')
    private issuerServiceGetByIdOrDocument: IssuerServiceGetByIdOrDocument,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('/:id')
  async getByIdIssuer(
    @Param('id', new ParseUUIDPipe()) issuerId: string,
  ): Promise<Issuer> {
    this.logger.info('Get Controller Executing...');
    return this.issuerServiceGetByIdOrDocument.execute(issuerId);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(schemaCreateOperation))
  async createtIssuer(@Body() data: CreatePassDTO): Promise<Issuer> {
    this.logger.info('Post Conroller Executing...');
    delete data.password_confirmation;
    return this.issuerServiceCreate.execute(data);
  }

  @Put()
  @UsePipes(new JoiValidationPipe(schemaUpdatedOperation))
  async updatedIssuer(
    @Req() req: Request,
    @Body() data: UpdateDPassDTO,
  ): Promise<Issuer> {
    this.logger.info('Post Conroller Executing...');
    delete data.password_confirmation;
    return this.issuerServiceUpdate.execute(req.company.id, data);
  }

  @Delete()
  deleteIssuer(@Req() req: Request): Promise<object> {
    this.logger.info('Delete Controller Executing...');
    return this.issuerServiceDelete.execute(req.company.id);
  }
}
