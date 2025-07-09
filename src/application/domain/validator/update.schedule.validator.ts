import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { ScheduleStatusValidator } from './schedule.status.validator'
import { StringValidator } from './string.validator'

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

        if (schedule.date_schedule !== undefined) StringValidator.validate(schedule.date_schedule, 'date_schedule', false)

        if (schedule.status !== undefined) ScheduleStatusValidator.validate(schedule.status)
    }
}
