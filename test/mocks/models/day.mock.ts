import { Day } from '../../../src/application/domain/model/day'

export class dayMock {
    public static generateDayOn(): Day {
        const day = new Day()
        day.is_working = true
        day.start_time = '08:00'
        day.end_time = '18:00'
        return day
    }

    public static generateDayOff(): Day {
        const day = new Day()
        day.is_working = false
        return day
    }
}
