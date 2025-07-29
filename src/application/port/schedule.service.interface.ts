import { Schedule } from '../../application/domain/model/schedule'
import { IService } from './service.interface'

export interface IScheduleService extends IService<Schedule> {
    getAvailableSlots(employee_id: string, day: string, services_ids: Array<string>): Promise<Array<string>>
    updateStatusById(schedule_id: string, status: string): Promise<Schedule | undefined>
}
