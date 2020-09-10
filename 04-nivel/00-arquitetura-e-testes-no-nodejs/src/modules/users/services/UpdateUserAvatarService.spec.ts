import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

describe('UpdateUserAvatar', () => {
  it('should be able to update an avatar', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'some name',
      email: 'someemail@mail.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toEqual('avatar.jpg');
  });

  it('should not be able to update avatar for invalid user', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatarService.execute({
        user_id: 'some wrong id',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating it', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'some name',
      email: 'someemail@mail.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar1.jpg',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar1.jpg');
    expect(user.avatar).toEqual('avatar2.jpg');
  });
});
