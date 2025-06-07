import { ApiExceptionManager } from '../../ui/exception/api.exception.manager'
import { Service } from '../../application/domain/model/service'
import { Identifier } from '../../di/identifiers'
import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response  } from 'inversify-express-utils'
import { IServiceService } from '../../application/port/service.service.interface'
import { IQuery } from '../../application/port/query.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { Request, Response } from 'express'
import HttpStatus from 'http-status-codes'
import { NotFoundException } from '../../application/domain/exception/not.found.exception'
import { Strings } from '../../utils/strings'


@controller('/services')
export class ServiceController {
    constructor(
        @inject(Identifier.SERVICE_SERVICE) private readonly _serviceService: IServiceService,
    ) { }

    @httpPost('/')
    public async createService(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const newService: Service = new Service().fromJSON(req.body)
            delete newService.id
            const result: Service | undefined = await this._serviceService.add(newService)

            return res.status(HttpStatus.CREATED)
                .send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
               .send(handlerError.toJSON())
        }
    }

    @httpPatch('/:service_id')
    public async updateService(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const updateService: Service = new Service().fromJSON(req.body)
            updateService.id = req.params.id

            const result: Service | undefined = await this._serviceService.update(updateService)

            if (!result) throw new NotFoundException(
                Strings.SERVICE.NOT_FOUND,
                Strings.SERVICE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpDelete('/:service_id')
    public async deleteService(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: boolean = await this._serviceService.remove(req.params.id)

            if (!result) throw new NotFoundException(
                Strings.SERVICE.NOT_FOUND, Strings.
                SERVICE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllServices(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            const services: Array<Service> = await this._serviceService.getAll(query)

            const count: number = await this._serviceService.count(query)
            res.setHeader('X-Total-Count', count)

            return res.status(HttpStatus.OK).send(this.toJSONView(services))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/:service_id')
    public async getServiceById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ _id: req.params.service_id })
            const service: Service | undefined = await this._serviceService.getById(req.params.id, query)

            if (!service) throw new NotFoundException(
                Strings.SERVICE.NOT_FOUND, Strings.SERVICE.NOT_FOUND_DESCRIPTION
            )

            return res.status(HttpStatus.OK).send(this.toJSONView(service))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(service: Service | Array<Service> | undefined): object {
        if (service instanceof Array) return service.map(item => item.toJSON())
        return service?.toJSON()
    }
}
