import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { Service } from '../model/service'
import { NumberValidator } from './number.validator'
import { StringValidator } from './string.validator'

export class UpdateServiceValidator {
    public static validate(service: Service) {
        if (service.service_name !== undefined) {
            StringValidator.validate(service.service_name, 'service_name', false, false)
            if (service.service_name.length < 4) throw new ValidationException(
                Strings.ERROR_MESSAGE.INVALID_FIELDS,
                Strings.SERVICE.SERVICE_NAME_SHORTY
            )
        }

        if (service.price !== undefined) {
            NumberValidator.validate(service.price, 'price', false)
            if (service.price < 0) throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.SERVICE.PRICE_NOT_NEGATIVE)
        }

        if (service.estimated_duration !== undefined) NumberValidator.validate(
            service.estimated_duration, 'estimated_duration', false
        )

        if (service.description !== undefined) StringValidator.validate(service.description, 'description', true, true)
    }
}
