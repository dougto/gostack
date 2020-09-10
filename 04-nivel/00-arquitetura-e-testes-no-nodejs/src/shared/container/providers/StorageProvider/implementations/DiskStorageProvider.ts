import fs from 'fs';
import path from 'path';

import config from '@config/config';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(config.upload.tmpFolder, file),
      path.resolve(config.upload.uploadsFolder, file),
    );
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(config.upload.uploadsFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
