import { Router } from 'express';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

import ensureSession from '@modules/users/infra/http/middlewares/ensureSession';

const profileRouter = Router();

const profileController = new ProfileController();

profileRouter.use(ensureSession);

profileRouter.get('/', profileController.show);

profileRouter.put('/', profileController.update);

export default profileRouter;
