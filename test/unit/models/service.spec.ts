import { expect } from 'chai'
import { describe, it } from 'mocha'
import { ServiceMock } from '../../mocks/models/service.mock'
import { Service } from '../../../src/application/domain/model/service'
import { CreateServiceValidator } from '../../../src/application/domain/validator/create.service.validator'
import { UpdateServiceValidator } from '../../../src/application/domain/validator/update.service.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'

describe('Service Validator Tests', () => {

    describe('CreateServiceValidator', () => {

        it('should throw ValidationException when required fields are missing', () => {
            const service = new Service()
            expect(() => CreateServiceValidator.validate(service))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
        })

        it('should throw ValidationException when service_name is invalid', () => {
            const service = new Service().fromJSON(ServiceMock.generate())
            service.service_name = ''

            expect(() => CreateServiceValidator.validate(service))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when price is invalid', () => {
            const service = new Service().fromJSON(ServiceMock.generate())
            service.price = -10

            expect(() => CreateServiceValidator.validate(service))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when estimated_duration is invalid', () => {
            const service = new Service().fromJSON(ServiceMock.generate())
            service.estimated_duration = -30

            expect(() => CreateServiceValidator.validate(service))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when responsible_admin_id is invalid', () => {
            const service = new Service().fromJSON(ServiceMock.generate())
            service.responsible_admin_id = 'invalid_id'

            expect(() => CreateServiceValidator.validate(service))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT)
        })

        it('should pass validation when all required fields are valid', () => {
            const service = new Service().fromJSON(ServiceMock.generate())

            expect(() => CreateServiceValidator.validate(service))
                .not.to.throw(ValidationException)
        })
    })

    describe('UpdateServiceValidator', () => {

        it('should throw ValidationException when service_name is invalid', () => {
            const service = new Service().fromJSON(ServiceMock.generate())
            service.service_name = 'a'

            expect(() => UpdateServiceValidator.validate(service))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should throw ValidationException when price is invalid', () => {
            const service = new Service().fromJSON(ServiceMock.generate())
            service.price = -1

            expect(() => UpdateServiceValidator.validate(service))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should pass validation when all fields are valid', () => {
            const service = new Service().fromJSON(ServiceMock.generate())

            expect(() => UpdateServiceValidator.validate(service))
                .not.to.throw(ValidationException)
        })
    })
})
