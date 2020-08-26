import { startOfHour } from 'date-fns';
import AppointmentsRepository from '../repositories/Appointments.repository';
import Appointment from '../models/Appointment';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: Request): Appointment {
    const appointmentDate = startOfHour(date);

    if (this.appointmentsRepository.findByDate(appointmentDate)) {
      throw Error('This time isn`t available.');
    }

    return this.appointmentsRepository.create({ provider, date: appointmentDate });
  }
}

export default CreateAppointmentService;
