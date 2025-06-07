import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { StringValidator } from './string.validator'

export class CreateScheduleValidator {
    public static validate(schedule: any) {
        const fields: Array<string> = []

        // Required fields
        if (schedule.responsible_employee_id === undefined) fields.push('responsible_employee_id')
        else ObjectIdValidator.validate(schedule.responsible_employee_id, Strings.EMPLOYEE.PARAM_ID_NOT_VALID_FORMAT)

        if (schedule.responsible_client_id === undefined) fields.push('responsible_client_id')
        else ObjectIdValidator.validate(schedule.responsible_client_id, Strings.CLIENT.PARAM_ID_NOT_VALID_FORMAT)

        if (schedule.date_schedule === undefined) fields.push('date_schedule')
        else StringValidator.validate(schedule.date_schedule, 'date_schedule', false)

        if (fields.length > 0) throw new ValidationException('REQUIRED_FIELDS', fields.join(', '))
    }
}
