import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

const IS_PUBLIC_KEY = process.env.IS_PUBLIC_KEY;

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Enable authentication globally
  // https://docs.nestjs.com/security/authentication#enable-authentication-globally
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
