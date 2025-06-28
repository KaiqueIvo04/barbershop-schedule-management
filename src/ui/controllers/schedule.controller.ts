import { IScheduleService } from '../../application/port/schedule.service.interface'
import { Identifier } from '../../di/identifiers'
import { inject } from 'inversify'
import { Schedule } from '../../application/domain/model/schedule'
import { ApiExceptionManager } from '../../ui/exception/api.exception.manager'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { Strings } from '../../utils/strings'
import { NotFoundException } from '../../application/domain/exception/not.found.exception'
import { IQuery } from '../../application/port/query.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { ValidationException } from '../../application/domain/exception/validation.exception'

@controller('/v1/schedules')
export class ScheduleController {
    constructor(
        @inject(Identifier.SCHEDULE_SERVICE) private readonly _scheduleService: IScheduleService,
    ) {}

    @httpPost('/')
    public async createSchedule(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const newSchedule: Schedule = new Schedule().fromJSON(req.body)
            delete newSchedule.id
            const result: Schedule | undefined = await this._scheduleService.add(newSchedule)

            return res.status(HttpStatus.CREATED)
                .send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
               .send(handlerError.toJSON())
        }
    }

    @httpPatch('/:schedule_id')
    public async updateSchedule(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const updateSchedule: Schedule = new Schedule().fromJSON(req.body)
            updateSchedule.id = req.params.schedule_id

            const result: Schedule | undefined = await this._scheduleService.update(updateSchedule)

            if (!result) throw new NotFoundException(
                Strings.SCHEDULE.NOT_FOUND,
                Strings.SCHEDULE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.OK)
                .send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
               .send(handlerError.toJSON())
        }
    }

    @httpDelete('/:schedule_id')
    public async deleteSchedule(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: boolean = await this._scheduleService.remove(req.params.schedule_id)

            if (!result) throw new NotFoundException(
                Strings.SCHEDULE.NOT_FOUND,
                Strings.SCHEDULE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
               .send(handlerError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllSchedules(@request() req: Request, @response() res: Response): Promise<Response> {
        try {

            const query: IQuery = new Query().fromJSON(req.query)
            const schedules: Array<Schedule> = await this._scheduleService.getAll(query)

            const count: number = await this._scheduleService.count(query)
            res.setHeader('X-Total-Count', count)

            return res.status(HttpStatus.OK).send(this.toJSONView(schedules))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
               .send(handlerError.toJSON())
        }
    }

    @httpGet('/:schedule_id')
    public async getScheduleById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ _id: req.params.schedule_id })
            const schedule: Schedule | undefined = await this._scheduleService.getById(req.params.schedule_id, query)

            if (!schedule) throw new NotFoundException(
                Strings.SCHEDULE.NOT_FOUND,
                Strings.SCHEDULE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.OK).send(this.toJSONView(schedule))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
               .send(handlerError.toJSON())
        }
    }

    @httpGet('/avaliableslots/:employee_id')
    public async getAvaliableSlots(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)

            if ((!query.filters.day) || (!query.filters.service_id)) throw new ValidationException(
                Strings.SCHEDULE.QUERY_AVALIABLE_SLOTS_NOT_VALID,
                Strings.SCHEDULE.QUERY_AVALIABLE_SLOTS_NOT_VALID_DESC
            )

            const result: Array<string> = await this._scheduleService.getAvaliableSlots(req.params.employee_id, query)

            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(schedule: Schedule | Array<Schedule> | undefined): object {
        if (schedule instanceof Array) return schedule.map(item => item.toJSON())
        return schedule?.toJSON()
    }
}
