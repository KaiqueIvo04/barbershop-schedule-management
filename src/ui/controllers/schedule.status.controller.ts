import { IScheduleService } from '../../application/port/schedule.service.interface'
import { Identifier } from '../../di/identifiers'
import { inject } from 'inversify'
import { controller, httpPut, request, response } from 'inversify-express-utils'
import { ILogger } from '../../utils/custom.logger'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { Schedule } from '../../application/domain/model/schedule'
import { NotFoundException } from '../../application/domain/exception/not.found.exception'
import { Strings } from '../../utils/strings'
import HttpStatus from 'http-status-codes'

@controller('/v1/schedules')
export class ScheduleStatusController {
    constructor(
        @inject(Identifier.SCHEDULE_SERVICE) private readonly _scheduleService: IScheduleService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) { }

    @httpPut('/:schedule_id/status')
    public async updateScheduleStatus(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const scheduleUpdated: Schedule | undefined = await this._scheduleService
                .updateStatusById(req.params.schedule_id, req.body.status)

            if (!scheduleUpdated) throw new NotFoundException(
                Strings.SCHEDULE.NOT_FOUND,
                Strings.SCHEDULE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.OK).send(this.toJSONView(scheduleUpdated))
        } catch (err: any) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code)
                .send(handleError.toJSON())
        }
    }

    private toJSONView(schedule: Schedule): object {
        return schedule.toJSON()
    }
}
