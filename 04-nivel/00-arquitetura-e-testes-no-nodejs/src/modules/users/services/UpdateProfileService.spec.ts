import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'some name',
      email: 'someemail@mail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'other name',
      email: 'otheremail@mail.com',
      old_password: '123456',
    });

    expect(updatedUser.name).toBe('other name');
    expect(updatedUser.email).toBe('otheremail@mail.com');
  });

  it('should not be able to update email to one already being used', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name one',
      email: 'email1@mail.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'name two',
      email: 'email2@mail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'other name',
        email: 'email2@mail.com',
        old_password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'some name',
      email: 'someemail@mail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'other name',
      email: 'otheremail@mail.com',
      password: '654321',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('654321');
  });

  it('should not be able to update password if old_password is wrong', async () => {
    const user = await fakeUsersRepository.create({
      name: 'some name',
      email: 'someemail@mail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'other name',
        email: 'otheremail@mail.com',
        old_password: 'aaaaaa',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update non existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'asdasd',
        name: 'other name',
        email: 'otheremail@mail.com',
        old_password: 'aaaaaa',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
