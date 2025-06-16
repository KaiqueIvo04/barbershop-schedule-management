import { JsonUtils } from '../utils/json.utils'
import { Entity } from './entity'

export class Day extends Entity {
    private _is_working?: boolean
    private _start_time?: string
    private _end_time?: string

    get is_working(): boolean | undefined {
        return this._is_working
    }

    set is_working(value: boolean | undefined) {
        this._is_working = value
    }

    get start_time(): string | undefined {
        return this._start_time
    }

    set start_time(value: string | undefined) {
        this._start_time = value
    }

    get end_time(): string | undefined {
        return this._end_time
    }

    set end_time(value: string | undefined) {
        this._end_time = value
    }

    public fromJSON(json: any): Day {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.is_working) this.is_working = json.is_working
        if (json.start_time) this.start_time = json.start_time
        if (json.end_time) this.end_time = json.end_time

        return this
    }

    public toJSON(): any {
        const resultJson: any = {
            is_working: this.is_working,
            start_time: this.start_time,
            end_time: this.end_time
        }

        return resultJson
    }
}
