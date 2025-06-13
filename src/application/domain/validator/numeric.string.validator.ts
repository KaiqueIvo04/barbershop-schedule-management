import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { StringValidator } from './string.validator'

export class NumericStringValidator {
    public static validate(text: string, field: string, allowEmpty?: boolean): void | ValidationException {
        StringValidator.validate(text, field, allowEmpty, true)

        if (!allowEmpty || text !== '') {
            this.validateNumericString(text, field)
        }
    }

    private static validateNumericString(text: string, field: string): void {
        if (!(/^[0-9]+$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/i).test(text)) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_NUMERIC_STRING.replace('{0}', field))
        }
    }
}
