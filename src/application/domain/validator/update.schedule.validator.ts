import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { DateValidator } from './date.validator'
import { ObjectIdValidator } from './object.id.validator'
import { ScheduleStatusValidator } from './schedule.status.validator'

export class UpdateScheduleValidator {

    public static validate(schedule: any) {
        if (schedule.id) {
            try {
                ObjectIdValidator.validate(schedule.id)
            } catch (err) {
                throw new ValidationException(Strings.SCHEDULE.PARAM_ID_NOT_VALID_FORMAT)
            }
        }
        if (schedule.responsible_employee_id !== undefined) {
            ObjectIdValidator.validate(
                schedule.responsible_employee_id,
                Strings.EMPLOYEE.PARAM_ID_NOT_VALID_FORMAT.replace('{0}', schedule.responsible_employee_id)
            )
        }

        if (schedule.responsible_client_id !== undefined) {
            ObjectIdValidator.validate(
                schedule.responsible_client_id,
                Strings.CLIENT.PARAM_ID_NOT_VALID_FORMAT.replace('{0}', schedule.responsible_client_id)
            )
        }

        if (schedule.services_ids !== undefined) {
            if (!Array.isArray(schedule.services_ids)) throw new ValidationException(
                Strings.SCHEDULE.SERVICES_IDS_NOT_VALID,
                Strings.SCHEDULE.SERVICES_IDS_NOT_VALID_DESC
            )

            if (schedule.services_ids.length === 0) throw new ValidationException(
                Strings.SCHEDULE.SERVICES_IDS_NOT_VALID,
                Strings.SCHEDULE.SERVICES_IDS_EMPTY
            )

            schedule.services_ids.forEach((service_id: string) => {
                ObjectIdValidator.validate(service_id, Strings.SERVICE.PARAM_ID_NOT_VALID_FORMAT)
            })
        }

        if (schedule.date_schedule !== undefined) {
            DateValidator.validate(schedule.date_schedule)
            const currentDate: Date = new Date()
            const providedDate: Date = new Date(schedule.date_schedule)
            if (currentDate >= providedDate) throw new ValidationException(Strings.SCHEDULE.PAST_DATE)
        }

        if (schedule.status !== undefined) ScheduleStatusValidator.validate(schedule.status)
    }
}
