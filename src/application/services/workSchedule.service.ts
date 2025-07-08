import { inject, injectable } from 'inversify'
import { IWorkScheduleRepository } from '../port/workSchedule.repository.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { WorkSchedule } from '../domain/model/workSchedule'
import { ConflictException } from '../domain/exception/conflict.exception'
import { Strings } from '../../utils/strings'
import { ValidationException } from '../domain/exception/validation.exception'
import { EventBusException } from '../domain/exception/eventbus.exception'
import { CreateWorkScheduleValidator } from '../domain/validator/create.workSchedule.validator'
import { UpdateWorkScheduleValidator } from '../domain/validator/update.workSchedule.validator'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IQuery } from '../port/query.interface'
import { NotFoundException } from '../domain/exception/not.found.exception'

@injectable()
export class WorkScheduleService {
    constructor(
        @inject(Identifier.WORK_SCHEDULE_REPOSITORY) readonly _workScheduleRepository: IWorkScheduleRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus
    ) { }

    public async add(workSchedule: WorkSchedule): Promise<WorkSchedule | undefined> {
        try {
            // 1. Validate fields of workSchedule
            CreateWorkScheduleValidator.validate(workSchedule)

            // 2. Check if the responsible users exists
            await this.checkExistResponsibleUsers(workSchedule)

            // 3. Check possible duplicated workSchedule
            const workScheduleExists: WorkSchedule | undefined = await this._workScheduleRepository.checkExists(workSchedule)
            if (workScheduleExists) throw new ConflictException(Strings.WORK_SCHEDULE.ALREADY_REGISTERED)

            // 4. Create new WorkSchedule
            const newWorkSchedule: WorkSchedule | undefined = await this._workScheduleRepository.create(workSchedule)

            return Promise.resolve(newWorkSchedule)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<WorkSchedule>> {
        try {
            const workSchedules: Array<WorkSchedule> = await this._workScheduleRepository.find(query)
            return Promise.resolve(workSchedules)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getById(id: string, query: IQuery): Promise<WorkSchedule | undefined> {
        try {
            ObjectIdValidator.validate(id, Strings.WORK_SCHEDULE.PARAM_ID_NOT_VALID_FORMAT)
            const workSchedule: WorkSchedule | undefined = await this._workScheduleRepository.findOne(query)
            return Promise.resolve(workSchedule)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(workSchedule: WorkSchedule): Promise<WorkSchedule | undefined> {
        try {
            // 1. Validate fields of workSchedule
            UpdateWorkScheduleValidator.validate(workSchedule)

            // 2. Remove atributte unupdatable
            delete workSchedule.responsible_admin_id

            // 3. Check if the work schedule exists and employee exists
            if (workSchedule.employee_id) await this.checkExistResponsibleEmployee(workSchedule.employee_id!)

            const workScheduleExists: WorkSchedule | undefined = await this._workScheduleRepository.checkExists(workSchedule)
            if (!workScheduleExists) throw new ConflictException(
                Strings.WORK_SCHEDULE.ALREADY_REGISTERED,
                Strings.WORK_SCHEDULE.ALREADY_REGISTERED_DESC.replace('{0}', workSchedule.id)
            )

            // 4. Update WorkSchedule
            const updatedWorkSchedule: WorkSchedule | undefined = await this._workScheduleRepository.update(workSchedule)

            return Promise.resolve(updatedWorkSchedule)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        try {
            // 1. Validate id parameter
            ObjectIdValidator.validate(id, Strings.WORK_SCHEDULE.PARAM_ID_NOT_VALID_FORMAT)

            // 2. Check if work schedule exists
            const workSchedule = await this._workScheduleRepository.findById(id)
            if (!workSchedule) {
                throw new NotFoundException(
                    Strings.WORK_SCHEDULE.NOT_FOUND,
                    Strings.WORK_SCHEDULE.NOT_FOUND_DESCRIPTION
                )
            }

            // 3. Remove work schedule
            return this._workScheduleRepository.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async count(query: any): Promise<number> {
        try {
            const total: number = await this._workScheduleRepository.count(query)
            return Promise.resolve(total)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private async checkExistResponsibleUsers(workSchedule: WorkSchedule): Promise<any> {
        try {
            const resultEmployee: any = await this._eventBus.executeResource(
                'account.rpc', 'employee.findone', workSchedule.employee_id
            )
            const resultClient: any = await this._eventBus.executeResource(
                'account.rpc', 'admin.findone', workSchedule.responsible_admin_id
            )

            if (!resultEmployee) {
                throw new ValidationException(
                    Strings.EMPLOYEE.REGISTER_REQUIRED,
                    Strings.EMPLOYEE.DESCRIPTION_REGISTER_REQUIRED
                )
            }

            if (!resultClient) {
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

    private async checkExistResponsibleEmployee(employeeId: string): Promise<any> {
        try {
            const result: any = await this._eventBus.executeResource('account.rpc', 'admin.findone', employeeId)

            if (!result) {
                throw new ValidationException(
                    Strings.EMPLOYEE.REGISTER_REQUIRED,
                    Strings.EMPLOYEE.DESCRIPTION_REGISTER_REQUIRED
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
