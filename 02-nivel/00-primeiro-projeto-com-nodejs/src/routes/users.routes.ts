import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUser.service';
import UpdateUserAvatarService from '../services/UpdateUserAvatar.service';
import ensureSession from '../middlewares/ensureSession';
import config from '../config/config';

const usersRouter = Router();

const upload = multer(config.upload);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUserService = new CreateUserService();

  const user = await createUserService.execute({ name, email, password });

  delete user.password;

  return response.status(201).json({ user });
});

usersRouter.patch(
  '/avatar',
  ensureSession,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
