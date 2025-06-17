import { IRepository } from './repository.interface'
import { WorkSchedule } from '../domain/model/workSchedule'

export interface IWorkScheduleRepository extends IRepository<WorkSchedule> {
    checkExists(workSchedule: WorkSchedule): Promise<WorkSchedule | undefined>
}
