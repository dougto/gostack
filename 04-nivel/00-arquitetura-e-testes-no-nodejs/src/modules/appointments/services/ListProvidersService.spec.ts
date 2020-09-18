import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheRepository from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheRepository: FakeCacheRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheRepository = new FakeCacheRepository();
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheRepository,
    );
  });

  it('should be able to list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'some name',
      email: 'someemail@mail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'other name',
      email: 'otheremail@mail.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'some other name',
      email: 'someotheremail@mail.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      except_user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
