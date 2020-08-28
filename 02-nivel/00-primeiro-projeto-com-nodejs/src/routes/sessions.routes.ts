import { Router } from 'express';
import CreateSessionsService from '../services/CreateSessions.service';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const createSessionService = new CreateSessionsService();

  const { user, token } = await createSessionService.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
