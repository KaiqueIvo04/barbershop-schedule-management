import { Schedule } from '../domain/model/schedule'
import { IRepository } from './repository.interface'

export interface IScheduleRepository extends IRepository<Schedule> {
    checkExists(schedule: Schedule): Promise<Schedule | undefined>
}
