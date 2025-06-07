import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'

export class NumberValidator {
    public static validate(value: number, fieldName: string, allowsEmpty?: boolean): void | ValidationException {
        if (typeof value !== 'number' && (!allowsEmpty || value !== '')) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_NUMBER.replace('{0}', fieldName))
        }
    }
}
