import { injectable, inject } from 'tsyringe';
import { isAfter, getHours } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findByDay({
      provider_id,
      day,
      month,
      year,
    });

    const startingHour = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + startingHour,
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const currentDate = new Date(Date.now());
      const comparisonDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available:
          !hasAppointmentInHour && isAfter(comparisonDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListDayAvailabilityService;
