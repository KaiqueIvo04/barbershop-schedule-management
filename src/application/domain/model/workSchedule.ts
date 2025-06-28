import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { Entity } from './entity'
import { WorkDays } from './workDays'

export class WorkSchedule extends Entity implements IJSONSerializable, IJSONDeserializable<WorkSchedule> {
    private _employee_id?: string
    private _week_start_day?: Date
    private _work_days?: WorkDays
    private _responsible_admin_id?: string

    get employee_id(): string | undefined {
        return this._employee_id
    }
    set employee_id(value: string | undefined) {
        this._employee_id = value
    }

    get week_start_day(): Date | undefined {
        return this._week_start_day
    }
    set week_start_day(value: Date | undefined) {
        this._week_start_day = value
    }

    get responsible_admin_id(): string | undefined {
        return this._responsible_admin_id
    }
    set responsible_admin_id(value: string | undefined) {
        this._responsible_admin_id = value
    }

    get work_days(): WorkDays | undefined {
        return this._work_days
    }
    set work_days(value: WorkDays | undefined) {
        this._work_days = value
    }

    public containsDate(targetDate: Date): boolean {
        if (!this.week_start_day) return false

        const weekStart = new Date(this.week_start_day)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)

        // Normaliza datas
        const target: Date = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
        const start: Date = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
        const end: Date = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate())

        return target >= start && target <= end
    }

    public fromJSON(json: any): WorkSchedule {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id) super.id = json.id
        if (json.employee_id) this.employee_id = json.employee_id
        if (json.week_start_day) this.week_start_day = json.week_start_day
        if (json.work_days) this.work_days = new WorkDays().fromJSON(json.work_days)
        if (json.responsible_admin_id) this.responsible_admin_id = json.responsible_admin_id

        return this
    }

    public toJSON(): any {
        const resultJson: any = {
            id: this.id,
            created_at: this.created_at,
            updated_at: this.updated_at,
            employee_id: this.employee_id,
            week_start_day: this.week_start_day,
            work_days: this.work_days,
            responsible_admin_id: this.responsible_admin_id
        }

        return resultJson
    }
}
