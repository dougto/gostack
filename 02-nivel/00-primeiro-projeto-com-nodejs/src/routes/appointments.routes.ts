import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/Appointments.repository';
import CreateAppointmentService from '../services/CreateAppointment.service';

import ensureSession from '../middlewares/ensureSession';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureSession);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const createAppointmentService = new CreateAppointmentService();

  const appointment = await createAppointmentService.execute({
    provider_id,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
