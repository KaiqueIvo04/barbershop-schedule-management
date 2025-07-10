import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { Service } from '../model/service'
import { NumberValidator } from './number.validator'
import { ObjectIdValidator } from './object.id.validator'
import { StringValidator } from './string.validator'

export class CreateServiceValidator {
    public static validate(service: Service) {
        const fields: Array<string> = []

        // Required fields
        if (service.service_name === undefined) fields.push('service_name')
        else {
            StringValidator.validate(service.service_name, 'service_name', false, false)
            if (service.service_name.length < 4) throw new ValidationException(
                Strings.ERROR_MESSAGE.INVALID_FIELDS,
                Strings.SERVICE.SERVICE_NAME_SHORTY
            )
        }

        if (service.price === undefined) fields.push('price')
        else {
            NumberValidator.validate(service.price, 'price', false)
            if (service.price < 0) throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.SERVICE.PRICE_NOT_NEGATIVE)
        }

        if (service.estimated_duration === undefined) fields.push('estimated_duration')
        else {
            NumberValidator.validate(service.estimated_duration, 'estimated_duration', false)
            if (service.estimated_duration < 0) throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS,
                Strings.SERVICE.ESTIMATED_DURATION_NOT_NEGATIVE)
        }

        if (service.responsible_admin_id === undefined) fields.push('responsible_admin_id')
        else ObjectIdValidator.validate(service.responsible_admin_id)

        // Optional fields
        if (service.description !== undefined) StringValidator.validate(service.description, 'description', true, true)

        if (fields.length > 0) throw new ValidationException(
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', ')))
    }
}
