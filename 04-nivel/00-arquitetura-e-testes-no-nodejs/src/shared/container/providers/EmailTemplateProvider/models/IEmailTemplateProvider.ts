import IParseEmailTemplateDTO from '@shared/container/providers/EmailTemplateProvider/dtos/IParseEmailTemplateDTO';

export default interface IEmailTemplateProvider {
  parse(data: IParseEmailTemplateDTO): Promise<string>;
}
