import { IScheduleRepository } from '../port/schedule.repository.interface'
import { Identifier } from '../../di/identifiers'
import { inject, injectable } from 'inversify'
import { CreateScheduleValidator } from '../domain/validator/create.schedule.validator'
import { Schedule } from '../domain/model/schedule'
import { ConflictException } from '../../application/domain/exception/conflict.exception'
import { Strings } from '../../utils/strings'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { IQuery } from '../../application/port/query.interface'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { ScheduleStatus } from '../domain/utils/schedule.status'
import { UpdateScheduleValidator } from '../../application/domain/validator/update.schedule.validator'
import { IScheduleService } from '../port/schedule.service.interface'
import { EventBusException } from '../../application/domain/exception/eventbus.exception'

@injectable()
export class ScheduleService implements IScheduleService {

    constructor(
        @inject(Identifier.SCHEDULE_REPOSITORY) private readonly _scheduleRepository: IScheduleRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus
    ) { }

    public async add(schedule: Schedule): Promise<Schedule | undefined> {
        try {
            // 1. Validate fields of schedule
            CreateScheduleValidator.validate(schedule)

            // 2. Check if the responsible users exists
            await this.checkExistResponsibleUsers(schedule)

            // 3. Check possible duplicated schedule
            const scheduleExists: Schedule | undefined = await this._scheduleRepository.checkExists(schedule)
            if (scheduleExists) throw new ConflictException(
                Strings.SCHEDULE.ALREADY_REGISTERED,
                Strings.SCHEDULE.ALREADY_REGISTERED_DESC.replace('{0}', scheduleExists.id)
            )

            // 4. Set status to pending
            schedule.status = ScheduleStatus.PENDING

            // 5. Create schedule
            const newSchedule: Schedule | undefined = await this._scheduleRepository.create(schedule)
            // ESTÁ CRIANDO COM A HORA EM 3 HORAS A MAIS DO HORÁRIO ATUAL

            return Promise.resolve(newSchedule)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<Schedule>> {
        try {
            const schedules: Array<Schedule> = await this._scheduleRepository.find(query)
            return Promise.resolve(schedules)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(id: string, query: IQuery): Promise<Schedule | undefined> {
        try {
            ObjectIdValidator.validate(id, Strings.SCHEDULE.PARAM_ID_NOT_VALID_FORMAT)
            const schedule: Schedule | undefined = await this._scheduleRepository.findOne(query)
            return Promise.resolve(schedule)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(schedule: Schedule): Promise<Schedule | undefined> {
        try {
            // 1. Validate fields of schedule
            UpdateScheduleValidator.validate(schedule)

            // 2. Check if the responsible users exists
            await this.checkExistResponsibleUsers(schedule)

            // 3. Update schedule
            const updatedSchedule: Schedule | undefined = await this._scheduleRepository.update(schedule)
            return Promise.resolve(updatedSchedule)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id, Strings.SCHEDULE.PARAM_ID_NOT_VALID_FORMAT)

            const result: boolean = await this._scheduleRepository.delete(id)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async count(query: any): Promise<number> {
        try {
            const total: number = await this._scheduleRepository.count(query)
            return Promise.resolve(total)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private async checkExistResponsibleUsers(schedule: Schedule): Promise<any> {
        try {
            const resultEmployee: any = await this._eventBus.executeResource(
                'account.rpc', 'employee.findone', schedule.responsible_employee_id
            )
            const resultClient: any = await this._eventBus.executeResource(
                'account.rpc', 'client.findone', schedule.responsible_client_id
            )

            if (!resultEmployee) {
                throw new ValidationException(
                    Strings.EMPLOYEE.REGISTER_REQUIRED,
                    Strings.EMPLOYEE.DESCRIPTION_REGISTER_REQUIRED
                )
            }

            if (!resultClient) {
                throw new ValidationException(
                    Strings.CLIENT.REGISTER_REQUIRED,
                    Strings.CLIENT.DESCRIPTION_REGISTER_REQUIRED
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
