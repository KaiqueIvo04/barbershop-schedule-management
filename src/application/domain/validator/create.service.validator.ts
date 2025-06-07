import { ValidationException } from '../exception/validation.exception'
import { Service } from '../model/service'
import { NumberValidator } from './number.validator'
import { NumericStringValidator } from './numeric.string.validator'
import { ObjectIdValidator } from './object.id.validator'
import { StringValidator } from './string.validator'


export class CreateServiceValidator {
    public static validate(service: Service) {
        const fields: Array<string> = []

        // Required fields
        if (service.service_name === undefined) fields.push('service_name')
        else StringValidator.validate(service.service_name, 'service_name', false, false)

        if (service.price === undefined) fields.push('price')
        else NumberValidator.validate(service.price, 'price', false)

        if (service.estimated_duration === undefined) fields.push('estimated_duration')
        else NumericStringValidator.validate(service.estimated_duration, 'estimated_duration', false)

        if (service.responsible_admin_id === undefined) fields.push('responsible_admin_id')
        else ObjectIdValidator.validate(service.responsible_admin_id, 'The responsible_admin_id is not valid!')

        // Optional fields
        if (service.description !== undefined) StringValidator.validate(service.description, 'description', true, true)

        if (fields.length > 0) throw new ValidationException('REQUIRED_FIELDS', fields.join(', '))
    }
}
