import { Entity } from './entity'
import { Day } from './day'
import { JsonUtils } from '../utils/json.utils'

export class WorkDays extends Entity {
    private _monday?: Day
    private _tuesday?: Day
    private _wednesday?: Day
    private _thursday?: Day
    private _friday?: Day
    private _saturday?: Day
    private _sunday?: Day

    get monday(): Day | undefined {
        return this._monday
    }

    set monday(value: Day | undefined) {
        this._monday = value
    }

    get tuesday(): Day | undefined {
        return this._tuesday
    }

    set tuesday(value: Day | undefined) {
        this._tuesday = value
    }

    get wednesday(): Day | undefined {
        return this._wednesday
    }

    set wednesday(value: Day | undefined) {
        this._wednesday = value
    }

    get thursday(): Day | undefined {
        return this._thursday
    }

    set thursday(value: Day | undefined) {
        this._thursday = value
    }

    get friday(): Day | undefined {
        return this._friday
    }

    set friday(value: Day | undefined) {
        this._friday = value
    }

    get saturday(): Day | undefined {
        return this._saturday
    }

    set saturday(value: Day | undefined) {
        this._saturday = value
    }

    get sunday(): Day | undefined {
        return this._sunday
    }

    set sunday(value: Day | undefined) {
        this._sunday = value
    }

    public fromJSON(json: any): WorkDays {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.monday) this.monday = json.monday
        if (json.tuesday) this.tuesday = json.tuesday
        if (json.wednesday) this.wednesday = json.wednesday
        if (json.thursday) this.thursday = json.thursday
        if (json.friday) this.friday = json.friday
        if (json.saturday) this.saturday = json.saturday
        if (json.sunday) this.sunday = json.sunday

        return this
    }

    public toJSON(): any {
        const resultJson: any = {
            monday: this.monday,
            tuesday: this.tuesday,
            wednesday: this.wednesday,
            thursday: this.thursday,
            friday: this.friday,
            saturday: this.saturday,
            sunday: this.sunday
        }

        return resultJson
    }
}
