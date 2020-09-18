import { container } from 'tsyringe';

import { upload } from '@config/config';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import S3StorageProvider from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

interface IProviders {
  driver: 's3' | 'disk';
}

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[(upload as IProviders).driver],
);
