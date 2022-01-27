import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    // Request-scoped strategies
    // https://docs.nestjs.com/security/authentication#request-scoped-strategies
    const contextId = ContextIdFactory.getByRequest(req);
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user = await authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
