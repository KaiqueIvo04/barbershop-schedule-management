import { Strings } from '../../../utils/strings'
import { ValidationException } from '../exception/validation.exception'
import { CreateWorkDaysValidator } from './create.workDays.validator'
import { DateValidator } from './date.validator'
import { ObjectIdValidator } from './object.id.validator'

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

        if (workSchedule.week_start_day !== undefined) {
            DateValidator.validate(workSchedule.week_start_day)
            const currentDate: Date = new Date()
            const providedDate: Date = new Date(workSchedule.week_start_day)

            if (currentDate >= providedDate) throw new ValidationException(Strings.SCHEDULE.PAST_DATE)

            const date = new Date(workSchedule.week_start_day)
            if (date.getDay() !== 1) { // 1 = Segunda-feira
                throw new ValidationException(
                    Strings.WORK_SCHEDULE.WEEK_START_DAY_NOT_VALID,
                    Strings.WORK_SCHEDULE.WEEK_START_DAY_NOT_VALID_DESC
                )
            }
        }

        if (workSchedule.work_days !== undefined) CreateWorkDaysValidator.validate(workSchedule.work_days)
    }
}
