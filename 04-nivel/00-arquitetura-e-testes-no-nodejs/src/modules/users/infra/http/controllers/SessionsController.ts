import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionsService from '@modules/users/services/CreateSessionsService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email: reqemail, password } = request.body;

    const createSessionService = container.resolve(CreateSessionsService);

    const { user, token } = await createSessionService.execute({
      email: reqemail,
      password,
    });

    const { avatar, created_at, updated_at, email, id, name } = user;

    return response.json({
      user: { avatar, created_at, updated_at, email, id, name },
      token,
    });
  }
}
