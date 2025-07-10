import { expect } from 'chai'
import { describe, it } from 'mocha'
import { WorkScheduleMock } from '../../mocks/models/workSchedule.mock'
import { WorkSchedule } from '../../../src/application/domain/model/workSchedule'
import { CreateWorkScheduleValidator } from '../../../src/application/domain/validator/create.workSchedule.validator'
import { UpdateWorkScheduleValidator } from '../../../src/application/domain/validator/update.workSchedule.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'

describe('WorkSchedule Validator Tests', () => {

    describe('CreateWorkScheduleValidator', () => {

        it('should throw ValidationException when required fields are missing', () => {
            const workSchedule = new WorkSchedule()
            expect(() => CreateWorkScheduleValidator.validate(workSchedule))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
        })

        it('should throw ValidationException when employee_id is invalid', () => {
            const workSchedule = new WorkSchedule().fromJSON(WorkScheduleMock.generate())
            workSchedule.employee_id = 'invalid_id'

            expect(() => CreateWorkScheduleValidator.validate(workSchedule))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT)
        })

        it('should throw ValidationException when week_start_day is missing', () => {
            const workSchedule = new WorkSchedule().fromJSON(WorkScheduleMock.generate())
            workSchedule.week_start_day = undefined

            expect(() => CreateWorkScheduleValidator.validate(workSchedule))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
        })

        it('should throw ValidationException when responsible_admin_id is invalid', () => {
            const workSchedule = new WorkSchedule().fromJSON(WorkScheduleMock.generate())
            workSchedule.responsible_admin_id = 'invalid_id'

            expect(() => CreateWorkScheduleValidator.validate(workSchedule))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT)
        })

        it('should pass validation when all required fields are valid', () => {
            const workSchedule = new WorkSchedule().fromJSON(WorkScheduleMock.generate())

            expect(() => CreateWorkScheduleValidator.validate(workSchedule))
                .not.to.throw(ValidationException)
        })
    })

    describe('UpdateWorkScheduleValidator', () => {

        it('should throw ValidationException when employee_id is invalid', () => {
            const workSchedule = new WorkSchedule().fromJSON(WorkScheduleMock.generate())
            workSchedule.employee_id = 'invalid_id'

            expect(() => UpdateWorkScheduleValidator.validate(workSchedule))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT)
        })

        it('should pass validation when all fields are valid', () => {
            const workSchedule = new WorkSchedule().fromJSON(WorkScheduleMock.generate())

            expect(() => UpdateWorkScheduleValidator.validate(workSchedule))
                .not.to.throw(ValidationException)
        })
    })
})
