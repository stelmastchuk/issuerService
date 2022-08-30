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
  Logger,
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

@Controller('issuer')
export class IssuerController {
  private readonly logger = new Logger(IssuerController.name);

  constructor(
    @Inject('IssuerServiceCreate')
    private issuerServiceCreate: IssuerServiceCreate,
    @Inject('IssuerServiceUpdate')
    private issuerServiceUpdate: IssuerServiceUpdate,
    @Inject('IssuerServiceDelete')
    private issuerServiceDelete: IssuerServiceDelete,
    @Inject('IssuerServiceGetByIdOrDocument')
    private issuerServiceGetByIdOrDocument: IssuerServiceGetByIdOrDocument,
  ) {}

  @Get('/:id')
  async getByIdIssuer(
    @Param('id', new ParseUUIDPipe()) issuerId: string,
  ): Promise<Issuer> {
    this.logger.log('Get Executing...');
    return this.issuerServiceGetByIdOrDocument.execute(issuerId);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(schemaCreateOperation))
  async createtIssuer(@Body() data: CreatePassDTO): Promise<Issuer> {
    this.logger.log('Post Executing...');
    delete data.password_confirmation;
    return this.issuerServiceCreate.execute(data);
  }

  @Put()
  @UsePipes(new JoiValidationPipe(schemaUpdatedOperation))
  async updatedIssuer(
    @Req() req: Request,
    @Body() data: UpdateDPassDTO,
  ): Promise<Issuer> {
    this.logger.log('Put Executing...');
    delete data.password_confirmation;
    return this.issuerServiceUpdate.execute(req.company.id, data);
  }

  @Delete()
  deleteIssuer(@Req() req: Request): Promise<object> {
    this.logger.log('Delete Executing...');
    return this.issuerServiceDelete.execute(req.company.id);
  }
}
