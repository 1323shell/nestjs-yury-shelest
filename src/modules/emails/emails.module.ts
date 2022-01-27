import { Module } from '@nestjs/common';
import nodemailer from 'nodemailer';

import { EmailsService } from './emails.service';

@Module({
  providers: [
    {
      provide: 'NodemailerTestAccount',
      // This provider will be supplied by the value returned from a factory function
      // https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory
      useFactory: async () => {
        const testAccount = await nodemailer.createTestAccount();

        return testAccount;
      },
    },
    EmailsService,
  ],
  exports: [EmailsService],
})
export class EmailsModule {}
