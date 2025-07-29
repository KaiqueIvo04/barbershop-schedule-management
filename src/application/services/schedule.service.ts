import { IScheduleRepository } from '../port/schedule.repository.interface'
import { Identifier } from '../../di/identifiers'
import { inject, injectable } from 'inversify'
import { CreateScheduleValidator } from '../domain/validator/create.schedule.validator'
import { Schedule } from '../domain/model/schedule'
import { ConflictException } from '../domain/exception/conflict.exception'
import { Strings } from '../../utils/strings'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { IQuery } from '../port/query.interface'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { ScheduleStatus } from '../domain/utils/schedule.status'
import { UpdateScheduleValidator } from '../domain/validator/update.schedule.validator'
import { IScheduleService } from '../port/schedule.service.interface'
import { EventBusException } from '../domain/exception/eventbus.exception'
import { IWorkScheduleRepository } from '../port/workSchedule.repository.interface'
import { WorkSchedule } from '../domain/model/workSchedule'
import { IServiceRepository } from '../port/service.repository.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { Service } from '../domain/model/service'
import { Day } from '../domain/model/day'
import { StringValidator } from '../domain/validator/string.validator'
import { ScheduleStatusValidator } from '../domain/validator/schedule.status.validator'
import { NotFoundException } from '../domain/exception/not.found.exception'

@injectable()
export class ScheduleService implements IScheduleService {

    constructor(
        @inject(Identifier.SCHEDULE_REPOSITORY) private readonly _scheduleRepository: IScheduleRepository,
        @inject(Identifier.WORK_SCHEDULE_REPOSITORY) private readonly _workScheduleRepository: IWorkScheduleRepository,
        @inject(Identifier.SERVICE_REPOSITORY) private readonly _serviceRepository: IServiceRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus
    ) { }

    public async add(schedule: Schedule): Promise<Schedule | undefined> {
        try {
            // 1. Validate fields of schedule
            CreateScheduleValidator.validate(schedule)

            // 2. Check if the responsible users exists
            await this.checkExistResponsibleUsers(schedule)

            // 3. Check if the services exists
            for (const service of schedule.services_ids!) {
                const serviceExists: Service | undefined = await this._serviceRepository.findById(service)
                if (!serviceExists) throw new NotFoundException(
                    Strings.SERVICE.NOT_FOUND,
                    Strings.SERVICE.NOT_FOUND_DESCRIPTION
                )
            }

            // 4. Check if employee is available in date
            const scheduleDate = new Date(schedule.date_schedule!)
            const year = scheduleDate.getFullYear()
            const month = String(scheduleDate.getMonth() + 1).padStart(2, '0') // +1 months starts in 0
            const day = String(scheduleDate.getDate()).padStart(2, '0')

            const formattedDate = `${year}-${month}-${day}T00:00` // Put in format of function getAvailableSlots

            const slots: Array<string> = await this.getAvailableSlots( // Reuse of function of endpoint post/availableslots
                schedule.responsible_employee_id!,
                formattedDate, // Format yyyy-mm-ddT00:00
                schedule.services_ids!
            )
            if (slots.length === 0) throw new ValidationException(Strings.SCHEDULE.SLOTS_NOT_FOUND)

            // Extract time
            const requestedTime = `${scheduleDate.getHours().toString().padStart(2, '0')}:${scheduleDate.getMinutes().toString().padStart(2, '0')}`

            const isTimeAvailable = slots.includes(requestedTime) // Verify disponibility of times
            if (!isTimeAvailable) throw new ConflictException(Strings.SCHEDULE.UNAVAILABLE_TIME)

            // 5. Check possible duplicated schedule
            scheduleDate.setHours(scheduleDate.getHours() - 3) // Adjust to local time
            schedule.date_schedule = scheduleDate
            const scheduleExists: Schedule | undefined = await this._scheduleRepository.checkExists(schedule)
            if (scheduleExists) throw new ConflictException(
                Strings.SCHEDULE.ALREADY_REGISTERED,
                Strings.SCHEDULE.ALREADY_REGISTERED_DESC.replace('{0}', scheduleExists.id)
            )

            // 6. Set status to pending
            schedule.status = ScheduleStatus.PENDING

            // 7. Create schedule
            const newSchedule: Schedule | undefined = await this._scheduleRepository.create(schedule)

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

    public async getAvailableSlots(employee_id: string, day: string, services_ids: Array<string>): Promise<Array<string>> {
        try {
            // 1. Validate params
            ObjectIdValidator.validate(employee_id, Strings.EMPLOYEE.PARAM_ID_NOT_VALID_FORMAT)
            if (!day) {
                throw new ValidationException(
                    Strings.ERROR_MESSAGE.REQUIRED_FIELDS,
                    Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', 'day')
                )
            }
            if (!services_ids) throw new ValidationException(
                Strings.ERROR_MESSAGE.REQUIRED_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', 'services_ids')
            )
            if (services_ids.length === 0) throw new ValidationException(
                Strings.SCHEDULE.SERVICES_IDS_NOT_VALID,
                Strings.SCHEDULE.SERVICES_IDS_EMPTY
            )
            for (const serviceId of services_ids) {
                ObjectIdValidator.validate(serviceId, Strings.SERVICE.PARAM_ID_NOT_VALID_FORMAT)
            }

            const date: Date = new Date(day)

            // 2. Check exists employee and Find work schedule of employee
            await this.checkExistResponsibleEmployee(employee_id)
            const workSchedule: WorkSchedule | undefined = await this._workScheduleRepository.findByEmployeeAndDay(
                employee_id,
                date
            )
            if (!workSchedule) throw new ValidationException(
                Strings.WORK_SCHEDULE.NOT_FOUND,
                Strings.WORK_SCHEDULE.EMPLOYEE_NO_HAVE_WORK_SCHEDULE
            )

            // 3. Find and calculate total duration of target services
            const serviceQuery: IQuery = new Query()
            serviceQuery.addFilter({
                _id: { $in: services_ids }
            })

            const services: Array<Service> = await this._serviceRepository.find(serviceQuery)
            if (services.length === 0) throw new ValidationException(
                Strings.SERVICE.NOT_FOUND,
                Strings.SERVICE.NOT_FOUND_DESCRIPTION
            )

            const totalDuration = services.reduce((total, service) => {
                return total + (service.estimated_duration || 0)
            }, 0)

            if (totalDuration <= 0) throw new ValidationException(
                Strings.SCHEDULE.SERVICES_DURATIONS_INVALID
            )

            // 4. Find existing schedules of the date
            const existingSchedules: Array<Schedule> | undefined = await this._scheduleRepository.findByEmployeeAndDate(
                employee_id,
                date
            )

            // 5. Verify if employee works on this day
            const dayOfWeek: string = this.getDayOfWeekName(date)
            if (!workSchedule.work_days![dayOfWeek].is_working) {
                throw new ValidationException(
                    Strings.WORK_SCHEDULE.EMPLOYEE_NOT_WORKS
                )
            }

            // 6. Generate slots using total duration
            const daySchedule: Day = workSchedule.work_days![dayOfWeek]
            const slots: Array<string> = this.generateTimeSlots(
                daySchedule.start_time!,
                daySchedule.end_time!,
                totalDuration
            )

            // 7. Collect existing schedules durations and times
            const occupiedPeriods: Array<{ start: number, end: number }> = []

            if (existingSchedules && existingSchedules.length > 0) {
                for (const schedule of existingSchedules) {
                    const scheduleDuration = await this.getScheduleDuration(schedule)
                    const startTime = this.dateToMinutes(schedule.date_schedule!)
                    const endTime = startTime + scheduleDuration

                    occupiedPeriods.push({
                        start: startTime,
                        end: endTime
                    })
                }
            }

            // 8. Filter available slots using total duration
            const availableSlots = this.filterSlots(slots, occupiedPeriods, totalDuration)

            return availableSlots

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

            // 3. Check if the services exists
            for (const service of schedule.services_ids!) {
                const serviceExists: Service | undefined = await this._serviceRepository.findById(service)
                if (!serviceExists) throw new NotFoundException(
                    Strings.SERVICE.NOT_FOUND,
                    Strings.SERVICE.NOT_FOUND_DESCRIPTION
                )
            }

            // 3. Update schedule
            const updatedSchedule: Schedule | undefined = await this._scheduleRepository.update(schedule)
            return Promise.resolve(updatedSchedule)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async updateStatusById(schedule_id: string, status: string): Promise<Schedule | undefined> {
        try {
            // 1. Validate Ids and parameters
            ObjectIdValidator.validate(schedule_id, Strings.SCHEDULE.PARAM_ID_NOT_VALID_FORMAT)
            if (!status) throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('0', 'status')
            )
            StringValidator.validate(status, 'status', false, false)
            ScheduleStatusValidator.validate(status)

            // 2. Check if Schdule exists
            const schedule: Schedule | undefined = await this._scheduleRepository.findById(schedule_id)
            if (!schedule) return Promise.resolve(undefined)

            // 3. Check if Schedule is completed
            if (schedule.status === ScheduleStatus.COMPLETED) {
                throw new ValidationException(
                    Strings.SCHEDULE.STATUS_NOT_VALID,
                    Strings.SCHEDULE.ALREADY_COMPLETED_DESC
                )
            }

            // 7. Updates status of the Schedule and returns the register.
            const scheduleUpdated: Schedule | undefined = await this._scheduleRepository.updateStatusById(
                schedule_id,
                status
            )

            return Promise.resolve(scheduleUpdated)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        try {
            // 1. Validate id parameter
            ObjectIdValidator.validate(id, Strings.SCHEDULE.PARAM_ID_NOT_VALID_FORMAT)

            // 2. Check if schedule exists
            const schedule = await this._scheduleRepository.findById(id)
            if (!schedule) {
                throw new NotFoundException(
                    Strings.SCHEDULE.NOT_FOUND,
                    Strings.SCHEDULE.NOT_FOUND_DESCRIPTION
                )
            }

            // 3. Remove schedule
            return this._scheduleRepository.delete(id)
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

    // AUX FUNCTIONS
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

    private getDayOfWeekName(date: Date): string {
        const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        return weekDays[date.getDay()]
    }

    private generateTimeSlots(
        startTime: string,
        endTime: string,
        serviceDuration: number,
    ): Array<string> {
        const slots: Array<string> = []
        const start = this.timeToMinutes(startTime)
        const end = this.timeToMinutes(endTime)

        for (let time = start; time + serviceDuration <= end; time += 15) {
            slots.push(this.minutesToTime(time))
        }

        return slots
    }

    private filterSlots(
        slots: Array<string>,
        occupiedPeriods: Array<{ start: number, end: number }>,
        serviceDuration: number
    ): Array<string> {
        return slots.filter(slot => {
            const slotStart = this.timeToMinutes(slot)
            const slotEnd = slotStart + serviceDuration

            // Verifica se o slot não conflita com nenhum período ocupado
            return !occupiedPeriods.some(occupied => {
                // Verifica se há sobreposição entre o slot e o período ocupado
                return (slotStart < occupied.end && slotEnd > occupied.start)
            })
        })
    }

    private async getScheduleDuration(schedule: Schedule): Promise<number> {
        let duration: number = 0
        const queryIds: IQuery = new Query()
        queryIds.addFilter({
            _id: { $in: schedule.services_ids }
        })

        const services: Array<Service> | undefined = await this._serviceRepository.find(queryIds)

        services.forEach(service => {
            duration += service.estimated_duration!
        })
        return duration
    }

    // Convert date for minutes
    private dateToMinutes(date: Date): number {
        const hours = date.getUTCHours()
        const minutes = date.getUTCMinutes()
        return hours * 60 + minutes
    }
    // Convert "19:00" to minutes
    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }

    // Convert minutes for "19:00"
    private minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }
}
