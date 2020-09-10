import { Router } from 'express';
import multer from 'multer';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UsersAvatarController from '@modules/users/infra/http/controllers/UsersAvatarController';

import ensureSession from '@modules/users/infra/http/middlewares/ensureSession';
import config from '@config/config';

const usersRouter = Router();

const usersController = new UsersController();
const usersAvatarController = new UsersAvatarController();

const upload = multer(config.upload);

usersRouter.post('/', usersController.create);

usersRouter.patch(
  '/avatar',
  ensureSession,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
