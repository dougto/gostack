import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { RedisOptions } from 'ioredis';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IEmail {
  driver: 'ethereal' | 'ses';
  defaults: Record<string, Record<string, string>>;
}

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export const email: IEmail = {
  driver: process.env.EMAIL_DRIVER === 'ses' ? 'ses' : 'ethereal',
  defaults: {
    from: {
      email: 'exemplo@mail.com',
      name: 'exemplo',
    },
  },
};

export const jwt = {
  secret: process.env.APP_SECRET || 'dev',
  expiresIn: '7d',
};

export const upload = {
  driver: 'disk',
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
  aws: {
    bucket: 'dougto.app-go-barber',
  },
};

export const cache: ICacheConfig = {
  driver: 'redis',
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS || undefined,
    },
  },
};
