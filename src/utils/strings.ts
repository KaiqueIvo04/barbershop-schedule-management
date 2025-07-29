/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */
export abstract class Strings {
    public static readonly APP: any = {
        TITLE: 'SCHEDULE MANAGEMENT SERVICE',
    }

    public static readonly ADMIN: any = {
        REGISTER_REQUIRED: 'The responsible admin is not registered',
        DESCRIPTION_REGISTER_REQUIRED: 'The responsible admin must be registered',
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {admin_id} is not in valid format!',
    }

    public static readonly EMPLOYEE: any = {
        REGISTER_REQUIRED: 'The responsible employee is not registered',
        DESCRIPTION_REGISTER_REQUIRED: 'The responsible employee must be registered',
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {employee_id} is not in valid format!',
    }

    public static readonly CLIENT: any = {
        REGISTER_REQUIRED: 'The responsible client is not registered',
        DESCRIPTION_REGISTER_REQUIRED: 'The responsible client must be registered',
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {client_id} is not in valid format!',
    }

    public static readonly SERVICE: any = {
        ALREADY_REGISTERED: 'Service is already registered...',
        ALREADY_REGISTERED_DESC: 'This an existent Service: {0}.',
        PARAM_ID_NOT_VALID_FORMAT: 'The service id is not valid!',
        PRICE_NOT_NEGATIVE: 'The price of service can\'t be negative.',
        ESTIMATED_DURATION_NOT_NEGATIVE: 'The estimated duration of service can\'t be negative.',
        SERVICE_NAME_SHORTY: 'The service name must be greater than 4 characters.',
        NOT_FOUND: 'Service not found!',
        NOT_FOUND_DESCRIPTION: 'One or more service not found or already removed. A new operation for the same resource is required.',
    }

    public static readonly SCHEDULE: any = {
        ALREADY_REGISTERED: 'Schedule is already registered...',
        ALREADY_REGISTERED_DESC: 'This an existent Schedule: {0}.',
        PARAM_ID_NOT_VALID_FORMAT: 'The schedule id is not valid!',
        STATUS_NOT_VALID: 'The schedule status is not valid!',
        STATUS_NOT_VALID_DESC: 'The status not allowed to be updated.',
        ALREADY_COMPLETED_DESC: 'This schedule was completed.',
        QUERY_AVALIABLE_SLOTS_NOT_VALID_DESC: 'It\'s necessary to provide employee_id, services_ids and day.',
        DAY_NOT_VALID_DESC: 'The day parameter must be format of Date object.',
        PAST_DATE: 'The date provided has already passed.',
        SERVICES_IDS_NOT_VALID: 'The services ids are not valid!',
        SERVICES_IDS_NOT_VALID_DESC: 'The services ids must be an array of strings.',
        SERVICES_IDS_EMPTY: 'The services ids can not be empty list.',
        SERVICES_DURATIONS_INVALID: 'Services durations sum is less than or equal to zero.',
        SLOTS_NOT_FOUND: 'The vacancies for this day ended.',
        UNAVAILABLE_TIME: 'This time is not available in the employee\'s work schedule!',
        NOT_FOUND: 'Schedule not found!',
        NOT_FOUND_DESCRIPTION: 'Schedule not found or already removed. A new operation for the same resource is required.',
    }

    public static readonly WORK_SCHEDULE: any = {
        ALREADY_REGISTERED: 'Work schedule is already registered...',
        ALREADY_REGISTERED_DESC: 'This an existent Work Schedule: {0}.',
        NOT_FOUND: 'Work schedule not found!',
        NOT_FOUND_DESCRIPTION: 'Work schedule not found or already removed. A new operation for the same resource is required.',
        EMPLOYEE_NO_HAVE_WORK_SCHEDULE: 'This employee don\'t have work schedule for week of this day.',
        EMPLOYEE_NOT_WORKS: 'The employee don\'t works in this day!',
        WORK_DAYS_NOT_VALID: 'The work days are not valid!',
        WORK_DAYS_NOT_VALID_DESC: 'The work days must be an object with the following structure: {monday: {is_working: boolean, start_time: string, end_time: string}}, {tuesday...',
        WEEK_START_DAY_NOT_VALID: 'The week start day is not valid!',
        WEEK_START_DAY_NOT_VALID_DESC: 'The week start day must be a Monday!',
    }

    public static readonly ERROR_MESSAGE: any = {
        REQUEST_BODY_INVALID: 'Unable to process request body!',
        REQUEST_BODY_INVALID_DESC: 'Please verify that the JSON provided in the request body has a valid format and try again.',
        PROCEDURE_DISASSOCIATION_REQUIRED: 'It\'s necessary to disassociate the user from all procedure requests first!',
        ENDPOINT_NOT_FOUND: 'Endpoint {0} does not found!',
        UNEXPECTED: 'An unexpected error has occurred. Please try again later...',
        PARAMETER_CANNOT_BE_UPDATED: '{0} parameter cannot be updated.',
        PASSWORD_CANNOT_BE_UPDATED_DESC: 'A specific route to update user password already exists. ' +
            'Access PATCH /v1/auth/password to update your password.',
        OPERATION_CANT_BE_COMPLETED: 'The operation could not be performed successfully.',
        OPERATION_CANT_BE_COMPLETED_DESC: 'Probably one or more of the request parameters are incorrect.',
        INTERNAL_SERVER_ERROR: 'An internal server error has occurred.',
        INTERNAL_SERVER_ERROR_DESC: 'Check all parameters of the operation being requested.',
        VALIDATE: {
            REQUIRED_FIELDS: 'Required fields were not provided...',
            REQUIRED_FIELDS_DESC: '{0} are required!',
            UUID_NOT_VALID_FORMAT: 'Some ID provided does not have a valid format!',
            UUID_NOT_VALID_FORMAT_DESC: 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.',
            INVALID_FIELDS: 'One or more request fields are invalid...',
            INVALID_STRING: '{0} must be a string!',
            EMPTY_STRING: '{0} must have at least one character!',
            INVALID_NUMERIC_STRING: '{0} must only have numeric digits!',
            INVALID_NUMBER: '{0} must be a number!',
            INVALID_ALFABETIC_STRING: '{0} must only have alphabetic characters!',
            INVALID_ADDRESS_NUMBER: 'number must contains only letters, numbers and /.',
            INVALID_TEXT_FIELD: '{0} must contain a minimum of {1} and a maximum of {2} characters.',
            INVALID_NAME_LENGTH: 'Invalid name length. Name must be between {0} and {1} characters long.',
            MISMATCH: 'The data does not match the expected values.',
        },
        DATE: {
            YEAR_NOT_ALLOWED: 'Date {0} has year not allowed. The year must be greater than 1678 and less than 2261.',
            INVALID_DATE_FORMAT: 'Date: {0}, is not in valid ISO 8601 format.',
            INVALID_DATE_FORMAT_DESC: 'Date must be in the format: yyyy-MM-dd',
            INVALID_DATETIME_FORMAT: 'Datetime: {0}, is not in valid ISO 8601 format.',
            INVALID_DATETIME_FORMAT_DESC: 'Datetime must be in the format: yyyy-MM-ddTHH:mm'
        },
        EVENT_BUS: {
            DEFAULT_MESSAGE: 'An event bus error has occurred.',
            NO_CONNECTION_OPEN: 'No connection open!',
            UNEXPECTED_EVENT_NAME: 'Unexpected event name: {0}!'
        }
    }

    /**
     * @param param
     * @returns
     */
    public static stringsException(param: string) {
        return {
            ALREADY_REGISTERED: `A ${param.toLowerCase()} already registered!`,
            NOT_FOUND: `${param} not found!`,
            NOT_FOUND_DESCRIPTION: `${param} not found or already removed. A new operation for the same resource is required!`,
        }
    }
}
