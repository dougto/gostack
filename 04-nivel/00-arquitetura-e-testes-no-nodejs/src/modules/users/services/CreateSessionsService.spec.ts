import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createSessionsService: CreateSessionsService;
let createUserService: CreateUserService;

describe('CreateSessions', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createSessionsService = new CreateSessionsService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new session', async () => {
    const user = await createUserService.execute({
      name: 'some name',
      email: 'someemail@mail.com',
      password: '123456',
    });

    const session = await createSessionsService.execute({
      email: 'someemail@mail.com',
      password: '123456',
    });

    expect(session).toHaveProperty('token');
    expect(session.user).toEqual(user);
  });

  it('should not be able to create session for non existent user', async () => {
    createSessionsService.execute({
      email: 'someemail@mail.com',
      password: '123456',
    });

    await expect(
      createSessionsService.execute({
        email: 'someemail@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create session for user with incorrect password', async () => {
    await createUserService.execute({
      name: 'some name',
      email: 'someemail@mail.com',
      password: '123456',
    });

    await expect(
      createSessionsService.execute({
        email: 'someemail@mail.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
