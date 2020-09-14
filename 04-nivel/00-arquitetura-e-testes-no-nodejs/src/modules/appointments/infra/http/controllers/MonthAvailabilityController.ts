import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListMonthAvailabilityService from '@modules/appointments/services/ListMonthAvailabilityService';

export default class MonthAvailabilityController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.body;

    const listMonthAvailability = container.resolve(
      ListMonthAvailabilityService,
    );

    const monthAvailability = await listMonthAvailability.execute({
      provider_id,
      month,
      year,
    });

    return response.json(monthAvailability);
  }
}
