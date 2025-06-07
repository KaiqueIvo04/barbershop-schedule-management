import { Entity } from './entity'

export class ScheduleEntity extends Entity{
    public responsible_employee_id?: string
    public responsible_client_id?: string
    public date_schedule?: Date
    public status?: string
    public services_ids?: Array<string>
}
