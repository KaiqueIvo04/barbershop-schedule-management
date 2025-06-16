/**
 * Constants used in dependence injection.
 *
 * @abstract
 */
export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly HOME_CONTROLLER: any = Symbol.for('HomeController')
    public static readonly SCHEDULE_CONTROLLER: any = Symbol.for('ScheduleController')
    public static readonly SERVICE_CONTROLLER: any = Symbol.for('ServiceController')
    public static readonly WORK_SCHEDULE_CONTROLLER: any = Symbol.for('WorkScheduleController')

    // Services
    public static readonly SERVICE_SERVICE: any = Symbol.for('ServiceService')
    public static readonly SCHEDULE_SERVICE: any = Symbol.for('ScheduleService')
    public static readonly WORK_SCHEDULE_SERVICE: any = Symbol.for('WorkScheduleService')

    // Repositories
    public static readonly INTEGRATION_EVENT_REPOSITORY: any = Symbol.for('IntegrationEventRepository')
    public static readonly SERVICE_REPOSITORY: any = Symbol.for('ServiceRepository')
    public static readonly SCHEDULE_REPOSITORY: any = Symbol.for('ScheduleRepository')

    // Models
    public static readonly INTEGRATION_EVENT_REPO_MODEL: any = Symbol.for('IntegrationEventRepoModel')
    public static readonly SERVICE_REPO_MODEL: any = Symbol.for('ServiceRepoModel')
    public static readonly SCHEDULE_REPO_MODEL: any = Symbol.for('ScheduleRepoModel')

    // Mappers
    public static readonly SERVICE_ENTITY_MAPPER: any = Symbol.for('ServiceEntityMapper')
    public static readonly SCHEDULE_ENTITY_MAPPER: any = Symbol.for('ScheduleEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryRabbitMQ')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('ConnectionRabbitMQ')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')

    // Tasks
    public static readonly PUBLISH_EVENT_BUS_TASK: any = Symbol.for('PublishEventBusTask')
    public static readonly SUBSCRIBE_EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')
    public static readonly RPC_SERVER_EVENT_BUS_TASK: any = Symbol.for('RpcServerEventBusTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
