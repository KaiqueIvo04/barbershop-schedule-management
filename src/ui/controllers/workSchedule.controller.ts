import { Identifier } from '../../di/identifiers'
import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { IWorkScheduleService } from '../../application/port/wokSchedule.service.interface'
import { Request, Response } from 'express'
import { WorkSchedule } from '../../application/domain/model/workSchedule'
import HttpStatus from 'http-status-codes'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { NotFoundException } from '../../application/domain/exception/not.found.exception'
import { Strings } from '../../utils/strings'
import { Query } from '../../infrastructure/repository/query/query'
import { IQuery } from '../../application/port/query.interface'

@controller('/v1/workschedules')
export class WorkScheduleController {
    constructor(
        @inject(Identifier.WORK_SCHEDULE_SERVICE) private readonly _workScheduleService: IWorkScheduleService
    ) {}

    @httpPost('/')
    public async createWorkSchedule(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const newWorkSchedule: WorkSchedule = new WorkSchedule().fromJSON(req.body)
            delete newWorkSchedule.id
            const result: WorkSchedule | undefined = await this._workScheduleService.add(newWorkSchedule)

            return res.status(HttpStatus.CREATED)
                .send(result)
        } catch (err: any) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code)
                .send(handleError.toJSON())
        }
    }

    @httpPatch('/:workschedule_id')
    public async updateWorkSchedule(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const updateWorkSchedule: WorkSchedule = new WorkSchedule().fromJSON(req.body)
            updateWorkSchedule.id = req.params.workschedule_id

            const result: WorkSchedule | undefined = await this._workScheduleService.update(updateWorkSchedule)

            if (!result) throw new NotFoundException(
                Strings.WORK_SCHEDULE.NOT_FOUND,
                Strings.WORK_SCHEDULE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.OK)
                .send(result)
        } catch (err: any) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code)
                .send(handleError.toJSON())
        }
    }

    @httpDelete('/:id')
    public async deleteWorkSchedule(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: boolean = await this._workScheduleService.remove(req.params.id)

            if (!result) throw new NotFoundException(
                Strings.WORK_SCHEDULE.NOT_FOUND,
                Strings.WORK_SCHEDULE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.NO_CONTENT)
                .send()
        } catch (err: any) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code)
                .send(handleError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllWorkSchedules(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            const workSchedules: Array<WorkSchedule> = await this._workScheduleService.getAll(query)

            const count: number = await this._workScheduleService.count(query)
            res.setHeader('X-Total-Count', count)

            return res.status(HttpStatus.OK).send(this.toJSONView(workSchedules))
        } catch (err: any) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code)
                .send(handleError.toJSON())
        }
    }

    @httpGet('/:id')
    public async getWorkScheduleById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ _id: req.params.id })
            const workSchedule: WorkSchedule | undefined = await this._workScheduleService.getById(req.params.id, query)

            if (!workSchedule) throw new NotFoundException(
                Strings.WORK_SCHEDULE.NOT_FOUND,
                Strings.WORK_SCHEDULE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.OK).send(this.toJSONView(workSchedule))
        } catch (err: any) {
            const handleError = ApiExceptionManager.build(err)
            return res.status(handleError.code)
                .send(handleError.toJSON())
        }
    }

    private toJSONView(workSchedule: WorkSchedule | Array<WorkSchedule> | undefined): object {
        if (workSchedule instanceof Array) return workSchedule.map(item => item.toJSON())
        return workSchedule?.toJSON()
    }
}
