import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { inject, injectable } from 'tsyringe';

import { email } from '@config/config';
import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import ISendEmailDTO from '@shared/container/providers/EmailProvider/dtos/ISendEmailDTO';
import IEmailTemplateProvider from '@shared/container/providers/EmailTemplateProvider/models/IEmailTemplateProvider';

@injectable()
export default class SESEmailProvider implements IEmailProvider {
  private client: Transporter;

  constructor(
    @inject('EmailTemplateProvider')
    private emailTemplateProvider: IEmailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-east-1',
      }),
    });
  }

  public async sendEmail({
    to,
    subject,
    from,
    templateData,
  }: ISendEmailDTO): Promise<void> {
    await this.client.sendMail({
      from: {
        name: from?.name || email.defaults.from.email,
        address: from?.email || email.defaults.from.name,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.emailTemplateProvider.parse(templateData),
    });
  }
}
