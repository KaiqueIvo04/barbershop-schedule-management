import { IRepository } from './repository.interface'
import { WorkSchedule } from '../domain/model/workSchedule'

export interface IWorkScheduleRepository extends IRepository<WorkSchedule> {
    checkExists(workSchedule: WorkSchedule): Promise<WorkSchedule | undefined>
    findByEmployeeAndDay(employee_id: string, day: Date): Promise<WorkSchedule | undefined>
    findById(workSchedule_id: string): Promise<WorkSchedule | undefined>
}
