import { injectable } from 'inversify'
import { WorkScheduleEntity } from '../workSchedule.entity'
import { WorkSchedule } from '../../../application/domain/model/workSchedule'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { WorkDays } from '../../../application/domain/model/workDays'

@injectable()
export class WorkScheduleEntityMapper implements IEntityMapper<WorkSchedule, WorkScheduleEntity> {
    public transform(item: any): any {
        if (item instanceof WorkSchedule) return this.modelToModelEntity(item)
        return this.jsonToModel(item)
    }

    /**
     * Convert {WorkSchedule} to {WorkScheduleEntity}.
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown. 
     * @param item 
     * @returns 
     */
    public modelToModelEntity(item: WorkSchedule): WorkScheduleEntity {
        const result: WorkScheduleEntity = new WorkScheduleEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.employee_id !== undefined) result.employee_id = item.employee_id
        if (item.week_start_day !== undefined) result.week_start_day = item.week_start_day
        if (item.work_days !== undefined) result.work_days = item.work_days.toJSON()
        if (item.responsible_admin_id !== undefined) result.responsible_admin_id = item.responsible_admin_id

        return result
    }

    public jsonToModel(json: any): WorkSchedule {
        const result: WorkSchedule = new WorkSchedule()

        if (json.id !== undefined) result.id = json.id
        if (json.employee_id !== undefined) result.employee_id = json.employee_id
        if (json.week_start_day !== undefined) result.week_start_day = json.week_start_day
        if (json.work_days !== undefined) result.work_days = new WorkDays().fromJSON(json.work_days)
        if (json.responsible_admin_id !== undefined) result.responsible_admin_id = json.responsible_admin_id

        return result
    }
}
