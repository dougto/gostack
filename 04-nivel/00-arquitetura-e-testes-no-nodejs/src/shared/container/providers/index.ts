import { container } from 'tsyringe';

import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvider';
import EtherealEmailProvider from '@shared/container/providers/EmailProvider/implementations/EtherealEmailProvider';

import IEmailTemplateProvider from '@shared/container/providers/EmailTemplateProvider/models/IEmailTemplateProvider';
import HandlebarsEmailTemplateProvider from '@shared/container/providers/EmailTemplateProvider/implementations/HandlebarsEmailTemplateProvider';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IEmailTemplateProvider>(
  'EmailTemplateProvider',
  HandlebarsEmailTemplateProvider,
);

container.registerInstance<IEmailProvider>(
  'EmailProvider',
  container.resolve(EtherealEmailProvider),
);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
