import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { Entity } from './entity'

export class Service extends Entity implements IJSONSerializable, IJSONDeserializable<Service>{
    private _service_name?: string
    private _description?: string
    private _price?: number
    private _estimated_duration?: string
    private _responsible_admin_id?: string

    get service_name(): string | undefined {
        return this._service_name
    }
    set service_name(value: string | undefined) {
        this._service_name = value
    }

    get description(): string | undefined {
        return this._description
    }
    set description(value: string | undefined) {
        this._description = value
    }

    get price(): number | undefined {
        return this._price
    }
    set price(value: number | undefined) {
        this._price = value
    }

    get estimated_duration(): string | undefined {
        return this._estimated_duration
    }
    set estimated_duration(value: string | undefined) {
        this._estimated_duration = value
    }

    get responsible_admin_id(): string | undefined {
        return this._responsible_admin_id
    }
    set responsible_admin_id(value: string | undefined) {
        this._responsible_admin_id = value
    }

    public fromJSON(json: any): Service {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.service_name !== undefined) this.service_name = json.service_name
        if (json.description !== undefined) this.description = json.description
        if (json.price !== undefined) this.price = json.price
        if (json.estimated_duration !== undefined) this.estimated_duration = json.estimated_duration
        if (json.responsible_admin_id !== undefined) this.responsible_admin_id = json.responsible_admin_id

        return this
    }

    public toJSON() {
        const resultJson: any = {
            service_name: this.service_name,
            description: this.description,
            price: this.price,
            estimated_duration: this._estimated_duration,
            responsible_admin_id: this.responsible_admin_id
        }

        return resultJson
    }

}
