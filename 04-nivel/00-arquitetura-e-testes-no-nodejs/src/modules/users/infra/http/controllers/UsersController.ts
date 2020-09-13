import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name: reqname, email: reqemail, password } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      name: reqname,
      email: reqemail,
      password,
    });

    const { avatar, created_at, updated_at, email, id, name } = user;

    return response
      .status(201)
      .json({ user: { avatar, created_at, updated_at, email, id, name } });
  }
}
