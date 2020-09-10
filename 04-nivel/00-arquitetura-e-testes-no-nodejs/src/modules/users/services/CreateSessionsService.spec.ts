import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import AppError from '@shared/errors/AppError';

describe('CreateSessions', () => {
  it('should be able to create a new session', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createSessionsService = new CreateSessionsService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

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
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createSessionsService = new CreateSessionsService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    createSessionsService.execute({
      email: 'someemail@mail.com',
      password: '123456',
    });

    expect(
      createSessionsService.execute({
        email: 'someemail@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create session for user with incorrect password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createSessionsService = new CreateSessionsService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'some name',
      email: 'someemail@mail.com',
      password: '123456',
    });

    expect(
      createSessionsService.execute({
        email: 'someemail@mail.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
