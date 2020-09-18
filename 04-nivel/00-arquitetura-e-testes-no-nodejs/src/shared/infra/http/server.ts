import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import 'express-async-errors';

import routes from '@shared/infra/http/routes';
import rateLimiter from '@shared/infra/http/middlewares/RateLimiter';
import '@shared/infra/typeorm';
import '@shared/container';
import { upload } from '@config/config';
import AppError from '@shared/errors/AppError';

const app = express();

app.use(cors());
app.use(rateLimiter);
app.use(express.json());
app.use('files', express.static(upload.uploadsFolder));
app.use(routes);

app.use(errors);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .json({ status: 'error', message: error.message });
    }
    console.error(error.message);

    return response
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  },
);

app.listen(3333, () => {
  console.log('Server ready on port 3333');
});
