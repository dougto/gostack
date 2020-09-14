import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const provider_id = '12321312312';
    const user_id = '1231232';
    const appointmentDate = new Date(2020, 4, 10, 16);

    const appointment = await createAppointment.execute({
      date: appointmentDate,
      provider_id,
      user_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create two appointments at the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const provider_id = '12321312312';
    const user_id = '1231232';
    const appointmentDate = new Date(2020, 4, 10, 12);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id,
      user_id,
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to creater an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const provider_id = '12321312312';
    const user_id = '1231232';
    const appointmentDate = new Date(2020, 4, 10, 11);

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to creater an appointment with same user_id and provider_id', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const provider_id = '12321312312';
    const user_id = '12321312312';
    const appointmentDate = new Date(2020, 4, 10, 15);

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to creater an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const provider_id = '12321312312';
    const user_id = '1231232';
    const beforeEightAppointment = new Date(2020, 4, 11, 7);
    const afterFiveAppointment = new Date(2020, 4, 11, 18);

    await expect(
      createAppointment.execute({
        date: beforeEightAppointment,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createAppointment.execute({
        date: afterFiveAppointment,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
