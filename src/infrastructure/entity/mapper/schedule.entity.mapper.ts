import { injectable } from 'inversify'
import { Schedule } from '../../../application/domain/model/schedule'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { ScheduleEntity } from '../schedule.entity'

@injectable()
export class ScheduleEntityMapper implements IEntityMapper<Schedule, ScheduleEntity> {

    public transform(item: any): any {
        if (item instanceof Schedule) return this.modelToModelEntity(item)
        return this.jsonToModel(item)
    }

    /**
     * Convert {Schedule} to {ScheduleEntity}.
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown. 
     * @param item 
     * @returns 
     */
    public modelToModelEntity(item: Schedule): ScheduleEntity {
        const result: ScheduleEntity = new ScheduleEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.responsible_employee_id !== undefined) result.responsible_employee_id = item.responsible_employee_id
        if (item.responsible_client_id !== undefined) result.responsible_client_id = item.responsible_client_id
        if (item.date_schedule !== undefined) result.date_schedule = item.date_schedule
        if (item.status !== undefined) result.status = item.status
        if (item.responsible_admin_id !== undefined) result.responsible_admin_id = item.responsible_admin_id
        if (item.services_ids !== undefined) result.services_ids = item.services_ids

        return result
    }

    public jsonToModel(json: any): Schedule {
        const result: Schedule = new Schedule()

        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.created_at !== undefined) result.created_at = json.created_at
        if (json.updated_at !== undefined) result.updated_at = json.updated_at
        if (json.responsible_employee_id !== undefined) result.responsible_employee_id = json.responsible_employee_id
        if (json.responsible_client_id !== undefined) result.responsible_client_id = json.responsible_client_id
        if (json.date_schedule !== undefined) result.date_schedule = json.date_schedule
        if (json.status !== undefined) result.status = json.status
        if (json.responsible_admin_id !== undefined) result.responsible_admin_id = json.responsible_admin_id
        if (json.services_ids !== undefined) result.services_ids = json.services_ids

        return result
    }
}