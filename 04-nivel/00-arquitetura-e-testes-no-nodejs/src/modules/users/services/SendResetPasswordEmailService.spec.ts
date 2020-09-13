import FakeEmailProvider from '@shared/container/providers/EmailProvider/fakes/FakeEmailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendResetPasswordEmailService from '@modules/users/services/SendResetPasswordEmailService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeEmailProvider: FakeEmailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendResetPasswordEmail: SendResetPasswordEmailService;

describe('SendResetPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeEmailProvider = new FakeEmailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendResetPasswordEmail = new SendResetPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to send email', async () => {
    const sendMail = jest.spyOn(fakeEmailProvider, 'sendEmail');

    await fakeUsersRepository.create({
      name: 'some name',
      email: 'somemail@mail.com',
      password: '123456',
    });

    await sendResetPasswordEmail.execute({
      email: 'somemail@mail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send email to non existent user', async () => {
    await expect(
      sendResetPasswordEmail.execute({
        email: 'someotheremail@mail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a user token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'some name',
      email: 'somemail@mail.com',
      password: '123456',
    });

    await sendResetPasswordEmail.execute({
      email: 'somemail@mail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
