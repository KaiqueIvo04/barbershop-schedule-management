import { WorkSchedule } from '../../../src/application/domain/model/workSchedule'
import { WorkDays } from '../../../src/application/domain/model/workDays'
import { DefaultFunctions } from '../utils/default.functions'
import { WorkDaysMock } from './workDays.mock'

export class WorkScheduleMock {
    public static generate(): WorkSchedule {
        const workSchedule: WorkSchedule = new WorkSchedule()
        workSchedule.id = DefaultFunctions.generateObjectId()
        workSchedule.employee_id = DefaultFunctions.generateObjectId()
        workSchedule.week_start_day = new Date()
        workSchedule.work_days = new WorkDays().fromJSON(WorkDaysMock.generate())
        workSchedule.responsible_admin_id = DefaultFunctions.generateObjectId()

        return workSchedule
    }
}
