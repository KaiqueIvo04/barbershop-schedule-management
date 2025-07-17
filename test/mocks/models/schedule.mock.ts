import { Schedule } from '../../../src/application/domain/model/schedule'
import { DefaultFunctions } from '../utils/default.functions'

export class ScheduleMock {
    public static generate(): Schedule {
        const schedule: Schedule = new Schedule()
        schedule.id = DefaultFunctions.generateObjectId()
        schedule.responsible_employee_id = DefaultFunctions.generateObjectId()
        schedule.responsible_client_id = DefaultFunctions.generateObjectId()
        schedule.date_schedule = new Date('2025-07-09')
        schedule.services_ids = [
            DefaultFunctions.generateObjectId(),
            DefaultFunctions.generateObjectId()
        ]
        return schedule
    }
}
