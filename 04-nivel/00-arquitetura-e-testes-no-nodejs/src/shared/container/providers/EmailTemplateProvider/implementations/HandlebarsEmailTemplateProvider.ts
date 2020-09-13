import handlebars from 'handlebars';
import fs from 'fs';

import IParseEmailTemplateDTO from '@shared/container/providers/EmailTemplateProvider/dtos/IParseEmailTemplateDTO';
import IEmailTemplateProvider from '@shared/container/providers/EmailTemplateProvider/models/IEmailTemplateProvider';

class HandlebarsEmailTemplateProvider implements IEmailTemplateProvider {
  public async parse({
    template,
    variables,
  }: IParseEmailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(template, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsEmailTemplateProvider;
