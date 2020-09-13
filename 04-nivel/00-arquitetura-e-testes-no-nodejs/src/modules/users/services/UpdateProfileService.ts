import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name?: string;
  email?: string;
  password?: string;
  old_password: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const checkEmailUser = await this.usersRepository.findByEmail(email || '');

    if (!!checkEmailUser && checkEmailUser.id !== user.id) {
      throw new AppError('Email already being used');
    }

    const isOldPasswordValid = await this.hashProvider.compareHash(
      old_password,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new AppError('Invalid password');
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password)
      user.password = await this.hashProvider.generateHash(password);

    this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
