import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import config from '../config/config';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionsService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new AppError('User not found', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('User not found', 401);
    }

    const token = sign({}, config.jwt.secret, {
      subject: user.id,
      expiresIn: config.jwt.expiresIn,
    });

    return { user, token };
  }
}

export default CreateSessionsService;
