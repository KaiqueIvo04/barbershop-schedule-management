import { WorkDays } from '../../../src/application/domain/model/workDays'
import { dayMock } from './day.mock'

export class WorkDaysMock {
    public static generate(): WorkDays {
        const workDays: WorkDays = new WorkDays()

        workDays.monday = dayMock.generateDayOn()
        workDays.tuesday = dayMock.generateDayOn()
        workDays.wednesday = dayMock.generateDayOn()
        workDays.thursday = dayMock.generateDayOn()
        workDays.friday = dayMock.generateDayOn()
        workDays.saturday = dayMock.generateDayOff()
        workDays.sunday = dayMock.generateDayOff()

        return workDays
    }
}
