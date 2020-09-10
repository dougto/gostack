import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const provider_id = '12321312312';

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create two appointments at the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const provider_id = '12321312312';
    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id,
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
