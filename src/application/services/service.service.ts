import { inject, injectable } from 'inversify'
import { IServiceService } from '../port/service.service.interface'
import { Identifier } from '../../di/identifiers'
import { IServiceRepository } from '../port/service.repository.interface'
import { Service } from '../domain/model/service'
import { CreateServiceValidator } from '../domain/validator/create.service.validator'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { Strings } from '../../utils/strings'
import { EventBusException } from '../domain/exception/eventbus.exception'
import { UpdateServiceValidator } from '../domain/validator/update.service.validator'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IQuery } from '../port/query.interface'
import { ConflictException } from '../domain/exception/conflict.exception'
import { NotFoundException } from '../domain/exception/not.found.exception'

@injectable()
export class ServiceService implements IServiceService {
    constructor(
        @inject(Identifier.SERVICE_REPOSITORY) private readonly _serviceRepository: IServiceRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus
    ) { }

    public async add(service: Service): Promise<Service | undefined> {
        try {
            // 1. Validate fields of service
            CreateServiceValidator.validate(service)

            // 2. Check if the responsible admin exists
            if (service.responsible_admin_id) await this.checkExistResponsibleAdmin(service.responsible_admin_id)

            // 3. Check if the service already exists
            const serviceExists: Service | undefined = await this._serviceRepository.checkExists(service)
            if (serviceExists) throw new ConflictException(Strings.SERVICE.ALREADY_REGISTERED)

            // 4. Create new Service
            const newService: Service | undefined = await this._serviceRepository.create(service)

            return Promise.resolve(newService)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<Service>> {
        try {
            const services = await this._serviceRepository.find(query)
            return Promise.resolve(services)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(id: string, query: IQuery): Promise<Service | undefined> {
        try {
            ObjectIdValidator.validate(id, Strings.SERVICE.PARAM_ID_NOT_VALID_FORMAT)

            const service = await this._serviceRepository.findOne(query)
            return Promise.resolve(service)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(service: Service): Promise<Service | undefined> {
        try {
            // 1. Validate id parameter
            ObjectIdValidator.validate(service.id!, Strings.SERVICE.PARAM_ID_NOT_VALID_FORMAT)

            // 2. Validate fields of service
            UpdateServiceValidator.validate(service)

            // 3. Removing fields that are not allowed to be updated
            delete service.responsible_admin_id

            // 4. Update Service
            const updatedService: Service | undefined = await this._serviceRepository.update(service)
            return Promise.resolve(updatedService)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        try {
            // 1. Validate id parameter
            ObjectIdValidator.validate(id, Strings.SERVICE.PARAM_ID_NOT_VALID_FORMAT)

            // 2. Check if service exists
            const service = await this._serviceRepository.findById(id)
            if (!service) {
                throw new NotFoundException(
                    Strings.SERVICE.NOT_FOUND,
                    Strings.SERVICE.NOT_FOUND_DESCRIPTION
                )
            }

            // 3. Remove service
            return this._serviceRepository.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async count(query: any): Promise<number> {
        try {
            const total: number = await this._serviceRepository.count(query)
            return Promise.resolve(total)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private async checkExistResponsibleAdmin(adminId: string): Promise<any> {
        try {
            const result: any = await this._eventBus.executeResource('account.rpc', 'admin.findone', adminId)

            if (!result) {
                throw new ValidationException(
                    Strings.ADMIN.REGISTER_REQUIRED,
                    Strings.ADMIN.DESCRIPTION_REGISTER_REQUIRED
                )
            }

            return Promise.resolve(true)
        } catch (err: any) {
            if (!(err instanceof ValidationException))
                return Promise.reject(new EventBusException(Strings.ERROR_MESSAGE.EVENT_BUS.DEFAULT_MESSAGE, err.message))
            return Promise.reject(err)
        }
    }
}
