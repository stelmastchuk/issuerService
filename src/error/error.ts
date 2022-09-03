import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger: Logger;
  constructor() {
    this.logger = createLogger({
      level: 'info',
      exitOnError: false,
      format: format.json(),
      transports: [
        new transports.File({
          filename: `/home/ubuntu/logs/log.log`,
        }),
      ],
    });
  }
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const messageLog = exception.message;

    const prodErrorResponse: any = {
      timestamp: new Date().toISOString(),
      statusCode,
      message,
    };

    this.logger.error(
      `RequestMethod:: ${request.method}, StatusCode:: ${JSON.stringify(
        prodErrorResponse.statusCode,
      )}, TimeStamp:: ${JSON.stringify(
        prodErrorResponse.timestamp,
      )}, MessageError:: ${JSON.stringify(messageLog)} `,
    );
    response.status(statusCode).json(prodErrorResponse);
  }
}
