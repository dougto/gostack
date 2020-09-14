import { Router } from 'express';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import DayAvailabilityController from '@modules/appointments/infra/http/controllers/DayAvailabilityController';
import MonthAvailabilityController from '@modules/appointments/infra/http/controllers/MonthAvailabilityController';
import ensureSession from '@modules/users/infra/http/middlewares/ensureSession';

const providersRouter = Router();
const providersController = new ProvidersController();
const dayAvailabilityController = new DayAvailabilityController();
const monthAvailabilityController = new MonthAvailabilityController();

providersRouter.use(ensureSession);

providersRouter.get('/', providersController.list);

providersRouter.get(
  '/:provider_id/month-availability',
  monthAvailabilityController.list,
);

providersRouter.get(
  '/:provider_id/day-availability',
  dayAvailabilityController.list,
);

export default providersRouter;
