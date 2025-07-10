import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { CreateWorkDaysValidator } from './create.workDays.validator'
import { ObjectIdValidator } from './object.id.validator'
import { StringValidator } from './string.validator'

export class UpdateWorkScheduleValidator {
    public static validate(workSchedule: any) {
        if (workSchedule.id) {
            try {
                ObjectIdValidator.validate(workSchedule.id)
            } catch (err) {
                throw new ValidationException(Strings.SCHEDULE.PARAM_ID_NOT_VALID_FORMAT)
            }
        }
        if (workSchedule.employee_id !== undefined) ObjectIdValidator.validate(workSchedule.employee_id)

        if (workSchedule.week_start_day !== undefined) StringValidator.validate(
            workSchedule.week_start_day, 'week_start_day',
            false
        )

        if (workSchedule.work_days !== undefined) CreateWorkDaysValidator.validate(workSchedule.work_days)
    }
}
