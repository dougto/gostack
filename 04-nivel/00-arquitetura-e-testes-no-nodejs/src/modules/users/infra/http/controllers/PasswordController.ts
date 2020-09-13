import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendResetPasswordEmailService from '@modules/users/services/SendResetPasswordEmailService';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class PasswordController {
  public async sendResetPasswordEmail(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email } = request.body;

    const sendResetPasswordEmailService = container.resolve(
      SendResetPasswordEmailService,
    );

    await sendResetPasswordEmailService.execute({ email });

    return response.status(204).json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({ token, password });

    return response.status(204).json();
  }
}
