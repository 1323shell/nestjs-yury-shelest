import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): Record<string, any>;
}

export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  // include only fields with the @Expose() decorator
  intercept(context: ExecutionContext, next: CallHandler) {
    return next
      .handle()
      .pipe(map((data: any) => plainToInstance(this.dto, data)));
  }
}
