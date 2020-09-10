import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionsService from '@modules/users/services/CreateSessions.service';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSessionService = container.resolve(CreateSessionsService);

    const { user, token } = await createSessionService.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  }
}
