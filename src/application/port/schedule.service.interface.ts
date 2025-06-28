import { Schedule } from '../../application/domain/model/schedule'
import { IQuery } from './query.interface'
import { IService } from './service.interface'

export interface IScheduleService extends IService<Schedule> {
    getAvaliableSlots(employee_id: string, query: IQuery): Promise<Array<string>>
}
