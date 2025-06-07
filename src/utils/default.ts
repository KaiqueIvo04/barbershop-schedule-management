/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */
export abstract class Default {
    public static readonly APP_ID: string = 'schedule.app'
    public static readonly APP_TITLE: string = 'Schedule Service for API barbershop'
    public static readonly APP_DESCRIPTION: string = 'Service responsible for manage schedules of barbershop.'
    public static readonly NODE_ENV: string = 'development' // development, test, production
    public static readonly PORT_HTTP: number = 4000
    public static readonly PORT_HTTPS: number = 4001
    public static readonly SWAGGER_PATH: string = './src/ui/swagger/swagger.yaml'
    // public static readonly SWAGGER_URI: string = 'https://api.swaggerhub.com/apis/SMTC3/data-cross/v1/swagger.json'
    // public static readonly LOGO_URI: string = 'https://i.imgur.com/NSbFJ02.png'

    // MongoDB
    public static readonly MONGODB_URI: string = 'mongodb://localhost:27017/barbershop-account'
    public static readonly MONGODB_URI_TEST: string = 'mongodb://localhost:27017/barbershop-account-test'

    // RabbitMQ
    public static readonly RABBITMQ_URI: string = 'amqp://guest:guest@127.0.0.1:5672'

    // Log
    public static readonly LOG_DIR: string = 'logs'

    // JWT
    public static readonly ISSUER: string = 'barbershop'

    // Certificate
    // To generate self-signed certificates, see: https://devcenter.heroku.com/articles/ssl-certificate-self
    public static readonly SSL_KEY_PATH: string = '../.certs/server_key.pem'
    public static readonly SSL_CERT_PATH: string = '../.certs/server_cert.pem'
}
