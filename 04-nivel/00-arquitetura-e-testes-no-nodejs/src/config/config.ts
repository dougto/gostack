import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  jwt: {
    secret: '8a38d7a8833de949e8c1dd5ab0be5e6b',
    expiresIn: '7d',
  },
  upload: {
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
  },
};
