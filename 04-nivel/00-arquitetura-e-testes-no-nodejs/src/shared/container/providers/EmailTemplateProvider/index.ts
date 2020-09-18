import { container } from 'tsyringe';

import IEmailTemplateProvider from '@shared/container/providers/EmailTemplateProvider/models/IEmailTemplateProvider';
import HandlebarsEmailTemplateProvider from '@shared/container/providers/EmailTemplateProvider/implementations/HandlebarsEmailTemplateProvider';

container.registerSingleton<IEmailTemplateProvider>(
  'EmailTemplateProvider',
  HandlebarsEmailTemplateProvider,
);
