import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/Appointments.repository';
import CreateAppointmentService from '../services/CreateAppointment.service';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();
const createAppointmentService = new CreateAppointmentService(appointmentsRepository);

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.findAll();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);
    const appointment = createAppointmentService.execute({ provider, date: parsedDate });

    return response.json(appointment);
  } catch(error) {
    return response.status(400).json({ error: error.message });
  }
});

export default appointmentsRouter;
