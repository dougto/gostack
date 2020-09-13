import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfileService = container.resolve(ShowProfileService);

    const user = await showProfileService.execute({
      user_id,
    });

    const { avatar, created_at, updated_at, email, id, name } = user;

    return response
      .status(201)
      .json({ user: { avatar, created_at, updated_at, email, id, name } });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const {
      name: reqname,
      email: reqemail,
      password,
      old_password,
    } = request.body;
    const user_id = request.user.id;

    const updateProfileService = container.resolve(UpdateProfileService);

    const user = await updateProfileService.execute({
      user_id,
      name: reqname,
      email: reqemail,
      password,
      old_password,
    });

    const { avatar, created_at, updated_at, email, id, name } = user;

    return response
      .status(201)
      .json({ user: { avatar, created_at, updated_at, email, id, name } });
  }
}
