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

        if (json.monday) this.monday = new Day().fromJSON(json.monday)
        if (json.tuesday) this.tuesday = new Day().fromJSON(json.tuesday)
        if (json.wednesday) this.wednesday = new Day().fromJSON(json.wednesday)
        if (json.thursday) this.thursday = new Day().fromJSON(json.thursday)
        if (json.friday) this.friday = new Day().fromJSON(json.friday)
        if (json.saturday) this.saturday = new Day().fromJSON(json.saturday)
        if (json.sunday) this.sunday = new Day().fromJSON(json.sunday)

        return this
    }
    // RESOLVER BUG QUE NÃO DEIXA COLOCAR UM DIA COM is_working = false
    public toJSON(): any {
        const resultJson: any = {
            monday: this.monday && Object.keys(this.monday).length ? this.monday.toJSON() : undefined,
            tuesday: this.tuesday && Object.keys(this.tuesday).length ? this.tuesday.toJSON() : undefined,
            wednesday: this.wednesday && Object.keys(this.wednesday).length ? this.wednesday.toJSON() : undefined,
            thursday: this.thursday && Object.keys(this.thursday).length ? this.thursday.toJSON() : undefined,
            friday: this.friday && Object.keys(this.friday).length ? this.friday.toJSON() : undefined,
            saturday: this.saturday && Object.keys(this.saturday).length ? this.saturday.toJSON() : undefined,
            sunday: this.sunday && Object.keys(this.sunday).length ? this.sunday.toJSON() : undefined
        }

        return resultJson
    }
}
