import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'

export class DateValidator {
  public static validate(dateTime: string): void | ValidationException {
    // Validar o formato: YYYY-MM-DDTHH:mm
    const regex = /^\d{4}-(0[1-9]|1[0-2])-\d\dT([01]\d|2[0-3]):[0-5]\d$/
    if (!regex.test(dateTime)) {
      throw new ValidationException(
        Strings.ERROR_MESSAGE.DATE.INVALID_DATE_FORMAT.replace('{0}', dateTime),
        Strings.ERROR_MESSAGE.DATE.INVALID_DATETIME_FORMAT_DESC
      )
    }

    const [date, time] = dateTime.split('T')

    // Validar a parte da data
    const parts = date.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const day = parseInt(parts[2], 10)
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // Ajuste para anos bissextos
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLength[1] = 29
    }

    if (!(day > 0 && day <= monthLength[month - 1])) {
      throw new ValidationException(
        Strings.ERROR_MESSAGE.DATE.INVALID_DATE_FORMAT.replace('{0}', dateTime)
      )
    }

    // Outra validação para horas e minutos
    const [hourStr, minuteStr] = time.split(':')
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)

    if (!(hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59)) {
      throw new ValidationException(
        Strings.ERROR_MESSAGE.DATE.INVALID_DATE_FORMAT.replace('{0}', dateTime)
      )
    }
  }

  public static validateDateOnly(date: string): void | ValidationException {
    // Validar o formato: YYYY-MM-DD
    const regex = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/
    if (!regex.test(date)) {
      throw new ValidationException(
        Strings.ERROR_MESSAGE.DATE.INVALID_DATE_FORMAT.replace('{0}', date),
        'Expected format: YYYY-MM-DD'
      )
    }

    const [yearStr, monthStr, dayStr] = date.split('-')
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10)
    const day = parseInt(dayStr, 10)

    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // Ajuste para anos bissextos
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLength[1] = 29
    }

    // Validação lógica da data
    if (month < 1 || month > 12 || day < 1 || day > monthLength[month - 1]) {
      throw new ValidationException(
        Strings.ERROR_MESSAGE.DATE.INVALID_DATE_FORMAT.replace('{0}', date),
        'Invalid day for the given month'
      )
    }
  }
}
