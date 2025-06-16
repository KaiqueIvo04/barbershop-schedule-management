import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { Entity } from './entity'
import { WorkDays } from './workDays'

export class WorkSchedule extends Entity implements IJSONSerializable, IJSONDeserializable<WorkSchedule> {
    private _employee_id?: string
    private _week_start_day?: Date
    private _schedule?: WorkDays

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


    get schedule(): WorkDays | undefined {
        return this._schedule
    }
    set schedule(value: WorkDays | undefined) {
        this._schedule = value
    }

    public fromJSON(json: any): WorkSchedule {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id) super.id = json.id
        if (json.employee_id) this.employee_id = json.employee_id
        if (json.week_start_day) this.week_start_day = json.week_start_day
        if (json.schedule) this.schedule = json.schedule

        return this
    }

    public toJSON(): any {
        const resultJson: any = {
            id: this.id,
            created_at: this.created_at,
            updated_at: this.updated_at,
            employee_id: this.employee_id,
            week_start_day: this.week_start_day,
            schedule: this.schedule
        }

        return resultJson
    }
}
