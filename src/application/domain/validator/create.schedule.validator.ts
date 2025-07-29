import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { DateValidator } from './date.validator'
import { ObjectIdValidator } from './object.id.validator'

export class CreateScheduleValidator {
    public static validate(schedule: any) {
        const fields: Array<string> = []

        // Required fields
        if (schedule.responsible_employee_id === undefined) fields.push('responsible_employee_id')
        else ObjectIdValidator.validate(schedule.responsible_employee_id)

        if (schedule.responsible_client_id === undefined) fields.push('responsible_client_id')
        else ObjectIdValidator.validate(schedule.responsible_client_id)

        if (schedule.date_schedule === undefined) fields.push('date_schedule')
        else {
            DateValidator.validate(schedule.date_schedule)
            const currentDate: Date = new Date()
            const providedDate: Date = new Date(schedule.date_schedule)
            if (currentDate >= providedDate) throw new ValidationException(Strings.SCHEDULE.PAST_DATE)
        }

        if (schedule.services_ids === undefined) fields.push('services_ids')
        else {
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

        if (fields.length > 0) throw new ValidationException(
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', ')))
    }
}
