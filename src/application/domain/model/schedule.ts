import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { Entity } from './entity'

export class Schedule extends Entity implements IJSONSerializable, IJSONDeserializable<Schedule> {
    private _responsible_employee_id?: string
    private _responsible_client_id?: string
    private _date_schedule?: Date
    private _status?: string
    private _services_ids?: Array<string>

    public get responsible_employee_id(): string | undefined {
        return this._responsible_employee_id
    }
    public set responsible_employee_id(value: string | undefined) {
        this._responsible_employee_id = value
    }

    public get responsible_client_id(): string | undefined {
        return this._responsible_client_id
    }
    public set responsible_client_id(value: string | undefined) {
        this._responsible_client_id = value
    }

    public get date_schedule(): Date | undefined {
        return this._date_schedule
    }
    public set date_schedule(value: Date | undefined) {
        this._date_schedule = value
    }

    public get status(): string | undefined {
        return this._status
    }
    public set status(value: string | undefined) {
        this._status = value
    }

    public get services_ids(): string[] | undefined {
        return this._services_ids
    }
    public set services_ids(value: string[] | undefined) {
        this._services_ids = value
    }

    public fromJSON(json: any): Schedule {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id) super.id = json.id
        if (json.responsible_employee_id !== undefined) this.responsible_employee_id = json.responsible_employee_id
        if (json.responsible_client_id !== undefined) this.responsible_client_id = json.responsible_client_id
        if (json.date_schedule !== undefined) this.date_schedule = json.date_schedule
        if (json.status !== undefined) this.status = json.status
        if (json.services_ids !== undefined) this.services_ids = json.services_ids

        return this
    }

    public toJSON(): any {
        return {
            id: this.id,
            created_at: this.created_at,
            updated_at: this.updated_at,
            responsible_employee_id: this.responsible_employee_id,
            responsible_client_id: this.responsible_client_id,
            date_schedule: this.date_schedule,
            status: this.status,
            services_ids: this.services_ids
        }
    }
}
