import { BooleanValidator } from './boolean.validator'
import { ValidationException } from '../exception/validation.exception'
import { NumericStringValidator } from './numeric.string.validator'
import { Strings } from '../../../utils/strings'

export class CreateDayValidator {
    public static validate(day: any) {
        const fields: Array<string> = []

        // Required fields
        if (day.is_working === undefined) fields.push('is_working')
        else BooleanValidator.validate(day.is_working, 'is_working')

        if (day.is_working === true) {
            if (day.start_time === undefined) fields.push('start_time')
            else NumericStringValidator.validate(day.start_time, 'start_time', false)

            if (day.end_time === undefined) fields.push('end_time')
            else NumericStringValidator.validate(day.end_time, 'end_time', false)
        }

        if (fields.length > 0) throw new ValidationException(
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', ')))
    }
}
