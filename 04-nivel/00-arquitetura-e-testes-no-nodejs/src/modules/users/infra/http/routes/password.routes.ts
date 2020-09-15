import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import PasswordController from '@modules/users/infra/http/controllers/PasswordController';

const passwordRouter = Router();

const passwordController = new PasswordController();

passwordRouter.post(
  '/send-reset-email',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  passwordController.sendResetPasswordEmail,
);

passwordRouter.post(
  '/update',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  passwordController.update,
);

export default passwordRouter;
