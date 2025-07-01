import { Schedule } from '../domain/model/schedule'
import { IRepository } from './repository.interface'

export interface IScheduleRepository extends IRepository<Schedule> {
    checkExists(schedule: Schedule): Promise<Schedule | undefined>
    findByEmployeeAndDate(employee_id: string, date: Date): Promise<Array<Schedule> | undefined>
    findById(schedule_id: string): Promise<Schedule | undefined>
    updateStatusById(schedule_id: string, status: string): Promise<Schedule | undefined>
}
