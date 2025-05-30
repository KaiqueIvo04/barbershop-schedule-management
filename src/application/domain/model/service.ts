import { IJSONDeserializable } from "../utils/json.deserializable.interface"
import { IJSONSerializable } from "../utils/json.serializable.interface"
import { JsonUtils } from "../utils/json.utils"
import { Entity } from "./entity"

export class Service extends Entity implements IJSONSerializable, IJSONDeserializable<Service>{
    private _service_name?: string | undefined
    private _description?: string | undefined
    private _price?: Number | undefined
    private _estimated_duration?: string | undefined
    private _responsible_admin_id?: string | undefined
    
    public get service_name(): string | undefined {
        return this._service_name
    }
    public set service_name(value: string | undefined) {
        this._service_name = value
    }

    public get description(): string | undefined {
        return this._description
    }
    public set description(value: string | undefined) {
        this._description = value
    }
    
    public get price(): Number | undefined {
        return this._price
    }
    public set price(value: Number | undefined) {
        this._price = value
    }

    public get estimated_duration(): string | undefined {
        return this._estimated_duration
    }
    public set estimated_duration(value: string | undefined) {
        this._estimated_duration = value
    }

    public get responsible_admin_id(): string | undefined {
        return this._responsible_admin_id
    }
    public set responsible_admin_id(value: string | undefined) {
        this._responsible_admin_id = value
    }

    public fromJSON(json: any): Service {
        if (!json) return this
        if(typeof json === 'string' && JsonUtils.isJsonString(json)) {
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