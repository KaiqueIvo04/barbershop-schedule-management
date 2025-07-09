import { expect } from 'chai'
import { describe, it } from 'mocha'
import { ScheduleMock } from '../../mocks/models/schedule.mock'
import { Schedule } from '../../../src/application/domain/model/schedule'
import { CreateScheduleValidator } from '../../../src/application/domain/validator/create.schedule.validator'
import { UpdateScheduleValidator } from '../../../src/application/domain/validator/update.schedule.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'

describe('Schedule Validator Tests', () => {

    describe('CreateScheduleValidator', () => {

        it('should throw ValidationException when required fields are missing', () => {
            const schedule = new Schedule()
            expect(() => CreateScheduleValidator.validate(schedule))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
        })

        it('should throw ValidationException when responsible_employee_id is invalid', () => {
            const schedule = new Schedule().fromJSON(ScheduleMock.generate())
            schedule.responsible_employee_id = 'invalid_id'

            expect(() => CreateScheduleValidator.validate(schedule))
                .to.throw(ValidationException, Strings.EMPLOYEE.PARAM_ID_NOT_VALID_FORMAT)
        })

        it('should throw ValidationException when date_schedule is invalid', () => {
            const schedule = new Schedule().fromJSON(ScheduleMock.generate())
            schedule.date_schedule = undefined

            expect(() => CreateScheduleValidator.validate(schedule))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
        })

        // it('should throw ValidationException when status is invalid', () => {
        //     const schedule = new Schedule().fromJSON(ScheduleMock.generate())
        //     schedule.status = ''

        //     expect(() => CreateScheduleValidator.validate(schedule))
        //         .to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        // })

        it('should pass validation when all required fields are valid', () => {
            const schedule = new Schedule().fromJSON(ScheduleMock.generate())
            
            expect(() => CreateScheduleValidator.validate(schedule))
                .not.to.throw(ValidationException)
        })
    })

    describe('UpdateScheduleValidator', () => {

        it('should throw ValidationException if id is not in valid format', () => {
            const schedule = new Schedule()
            schedule.id = 'invalid_id'

            expect(() => UpdateScheduleValidator.validate(schedule))
                .to.throw(ValidationException, Strings.SCHEDULE.PARAM_ID_NOT_VALID_FORMAT)
        })

        it('should throw ValidationException when status is invalid', () => {
            const schedule = new Schedule().fromJSON(ScheduleMock.generate())
            schedule.status = ''

            expect(() => UpdateScheduleValidator.validate(schedule))
                .to.throw(ValidationException, Strings.ERROR_MESSAGE.INVALID_FIELDS)
        })

        it('should pass validation when fields are valid', () => {
            const schedule = new Schedule().fromJSON(ScheduleMock.generate())
            expect(() => UpdateScheduleValidator.validate(schedule))
                .not.to.throw(ValidationException)
        })
    })
})
