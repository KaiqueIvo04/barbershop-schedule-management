import { Service } from '../model/service'
import { NumberValidator } from './number.validator'
import { StringValidator } from './string.validator'

export class UpdateServiceValidator {
    public static validate(service: Service) {
        if (service.service_name !== undefined) StringValidator.validate(service.service_name, 'service_name', false, false)

        if (service.price !== undefined) NumberValidator.validate(service.price, 'price', false)

        if (service.estimated_duration !== undefined) NumberValidator.validate(
            service.estimated_duration, 'estimated_duration', false
        )

        if (service.description !== undefined) StringValidator.validate(service.description, 'description', true, true)
    }
}
