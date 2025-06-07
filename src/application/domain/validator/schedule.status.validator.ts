import { Strings } from '../../../utils/strings'
import { ScheduleStatus } from '../utils/schedule.status'
import { ValidationException } from '../exception/validation.exception'

export class ScheduleStatusValidator {
    public static validate(status: string) {
        if (!Object.values(ScheduleStatus).includes(status as ScheduleStatus)) {
            throw new ValidationException(
                Strings.SCHEDULE.STATUS_NOT_VALID,
                Strings.SCHEDULE.STATUS_NOT_VALID_DESC)
        }
    }
}
