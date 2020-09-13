import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import ISendEmailDTO from '@shared/container/providers/EmailProvider/dtos/ISendEmailDTO';

export default class FakeEmailProvider implements IEmailProvider {
  private messages: ISendEmailDTO[] = [];

  public async sendEmail(message: ISendEmailDTO): Promise<void> {
    this.messages.push(message);
  }
}
