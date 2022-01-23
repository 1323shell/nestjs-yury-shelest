import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

const PrismaErrors = [
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientUnknownRequestError,
];

interface PrismaError extends HttpException {
  code?: string;
  meta?: {
    cause: string;
  };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: PrismaError, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let { message } = exception;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = (exception.getResponse() as any).message;
    }

    if (PrismaErrors.some((error) => exception instanceof error)) {
      console.log(JSON.stringify(exception));
      status = HttpStatus.CONFLICT;

      if (exception.meta?.cause) {
        message = exception.meta.cause;
      } else {
        message = `Error code: ${exception.code}. Read more about this error here: https://www.prisma.io/docs/reference/api-reference/error-reference`;
      }
    }

    const responseBody = {
      status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
