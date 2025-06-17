import { Entity } from './entity'

export class WorkScheduleEntity extends Entity{
    public employee_id?: string
    public week_start_day?: Date
    public work_days?: any
    public responsible_admin_id?: string
}
