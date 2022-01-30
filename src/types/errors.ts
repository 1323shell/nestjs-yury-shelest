import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const PrismaErrors = [
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientUnknownRequestError,
];

export interface PrismaError extends HttpException {
  code?: string;
  meta?: {
    cause: string;
  };
}

export interface ErrorResponseBody {
  status: HttpStatus;
  timestamp: string;
  path: string;
  message: string;
}
