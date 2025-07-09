import { Strings } from '../../../utils/strings'
import { Day } from '../model/day'
import { ValidationException } from '../exception/validation.exception'
import { CreateDayValidator } from './create.day.validator'

export class CreateWorkDaysValidator {
    public static validate(workDays: any) {
        const fields: Array<string> = []

        // Required fields
        if (workDays.monday === undefined) fields.push('monday')
        else {
            if (!(workDays.monday instanceof Day)) throw new ValidationException(
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID,
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID_DESC
            )

            CreateDayValidator.validate(workDays.monday)
        }

        if (workDays.tuesday === undefined) fields.push('tuesday')
        else {
            if (!(workDays.tuesday instanceof Day)) throw new ValidationException(
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID,
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID_DESC
            )

            CreateDayValidator.validate(workDays.tuesday)
        }

        if (workDays.wednesday === undefined) fields.push('wednesday')
        else {
            if (!(workDays.wednesday instanceof Day)) throw new ValidationException(
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID,
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID_DESC
            )

            CreateDayValidator.validate(workDays.wednesday)
        }

        if (workDays.thursday === undefined) fields.push('thursday')
        else {
            if (!(workDays.thursday instanceof Day)) throw new ValidationException(
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID,
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID_DESC
            )

            CreateDayValidator.validate(workDays.thursday)
        }

        if (workDays.friday === undefined) fields.push('friday')
        else {
            if (!(workDays.friday instanceof Day)) throw new ValidationException(
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID,
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID_DESC
            )

            CreateDayValidator.validate(workDays.friday)
        }

        if (workDays.saturday === undefined) fields.push('saturday')
        else {
            if (!(workDays.saturday instanceof Day)) throw new ValidationException(
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID,
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID_DESC
            )

            CreateDayValidator.validate(workDays.saturday)
        }

        if (workDays.sunday === undefined) fields.push('sunday')
        else {
            if (!(workDays.sunday instanceof Day)) throw new ValidationException(
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID,
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID_DESC
            )

            CreateDayValidator.validate(workDays.sunday)
        }

        if (fields.length > 0) throw new ValidationException(
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', ')))
    }
}
