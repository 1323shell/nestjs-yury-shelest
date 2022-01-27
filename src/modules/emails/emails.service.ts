import { Inject, Injectable } from '@nestjs/common';
import nodemailer, { TestAccount } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { sendEmail } from 'src/types';

@Injectable()
export class EmailsService {
  private transporter: Mail;

  // Use @Inject() decorator to inject a custom provider that uses a string-valued token 'NodemailerTestAccount'
  // https://docs.nestjs.com/fundamentals/custom-providers#non-class-based-provider-tokens
  constructor(@Inject('NodemailerTestAccount') testAccount: TestAccount) {
    const { pass, smtp, user } = testAccount;

    this.transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail(data: sendEmail): Promise<string | false> {
    const info = await this.transporter.sendMail(data);

    // You can see the email only through an Ethereal account by following this link from response
    return nodemailer.getTestMessageUrl(info);
  }
}
