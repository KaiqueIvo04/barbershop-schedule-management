import { ObjectIdValidator } from './object.id.validator'
import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { WorkDays } from '../model/workDays'
import { CreateWorkDaysValidator } from './create.workDays.validator'
import { DateValidator } from './date.validator'

export class CreateWorkScheduleValidator {
    public static validate(workSchedule: any) {
        const fields: Array<string> = []

        // Required fields
        if (workSchedule.employee_id === undefined) fields.push('employee_id')
        else ObjectIdValidator.validate(workSchedule.employee_id)

        if (workSchedule.responsible_admin_id === undefined) fields.push('responsible_admin_id')
        else ObjectIdValidator.validate(workSchedule.responsible_admin_id)

        if (workSchedule.week_start_day === undefined) fields.push('week_start_day')
        else {
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

        if (workSchedule.work_days === undefined) fields.push('work_days')
        else {
            if (!(workSchedule.work_days instanceof WorkDays)) throw new ValidationException(
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID,
                Strings.WORK_SCHEDULE.WORK_DAYS_NOT_VALID_DESC
            )
            CreateWorkDaysValidator.validate(workSchedule.work_days)
        }

        if (fields.length > 0) throw new ValidationException(
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
            Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', ')))
    }
}
