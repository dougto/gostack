import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListDayAvailabilityService from '@modules/appointments/services/ListDayAvailabilityService';

export default class MonthAvailabilityController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.body;

    const listDayAvailability = container.resolve(ListDayAvailabilityService);

    const dayAvailability = await listDayAvailability.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(dayAvailability);
  }
}
