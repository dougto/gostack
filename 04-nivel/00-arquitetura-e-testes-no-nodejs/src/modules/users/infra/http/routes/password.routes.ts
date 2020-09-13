import { Router } from 'express';

import PasswordController from '@modules/users/infra/http/controllers/PasswordController';

const passwordRouter = Router();

const passwordController = new PasswordController();

passwordRouter.post(
  '/send-reset-email',
  passwordController.sendResetPasswordEmail,
);
passwordRouter.post('/update', passwordController.update);

export default passwordRouter;
