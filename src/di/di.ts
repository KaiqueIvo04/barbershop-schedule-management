import 'reflect-metadata'
import { Container } from 'inversify'
import { Identifier } from './identifiers'
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { BackgroundService } from '../background/background.service'
import { App } from '../app'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { ConnectionFactoryRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { IConnectionEventBus } from '../infrastructure/port/connection.event.bus.interface'
import { ConnectionRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { EventBusRabbitMQ } from '../infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IntegrationEventRepository } from '../infrastructure/repository/integration.event.repository'
import { IIntegrationEventRepository } from '../application/port/integration.event.repository.interface'
import { IntegrationEventRepoModel } from '../infrastructure/database/schema/integration.event.schema'
import { PublishEventBusTask } from '../background/task/publish.event.bus.task'
import { RpcServerEventBusTask } from '../background/task/rpc.server.event.bus.task'
import { HomeController } from '../ui/controllers/home.controller'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { Service } from '../application/domain/model/service'
import { ServiceEntity } from '../infrastructure/entity/service.entity'
import { ServiceEntityMapper } from '../infrastructure/entity/mapper/service.entity.mapper'
import { ServiceRepoModel } from '../infrastructure/database/schema/service.schema'
import { ScheduleRepoModel } from '../infrastructure/database/schema/schedule.schema'
import { Schedule } from '../application/domain/model/schedule'
import { ScheduleEntity } from '../infrastructure/entity/schedule.entity'
import { ScheduleEntityMapper } from '../infrastructure/entity/mapper/schedule.entity.mapper'
import { IServiceRepository } from '../application/port/service.repository.interface'
import { ServiceRepository } from '../infrastructure/repository/service.repository'
import { IScheduleRepository } from '../application/port/schedule.repository.interface'
import { ScheduleRepository } from '../infrastructure/repository/schedule.repository'

class IoC {
    private readonly _container: Container

    /**
     * Creates an instance of Di.
     * @private
     */
    constructor() {
        this._container = new Container()
        this.initDependencies()
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    get container(): Container {
        return this._container
    }

    /**
     * Initializes injectable containers.
     *
     * @private
     * @return void
     */
    private initDependencies(): void {
        this._container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this._container
            .bind(Identifier.HOME_CONTROLLER)
            .to(HomeController).inSingletonScope()
        // Services

        // Repositories Ok
        this._container
            .bind<IIntegrationEventRepository>(Identifier.INTEGRATION_EVENT_REPOSITORY)
            .to(IntegrationEventRepository).inSingletonScope()
        this._container
            .bind<IServiceRepository>(Identifier.SERVICE_REPOSITORY)
            .to(ServiceRepository).inSingletonScope()
        this._container
            .bind<IScheduleRepository>(Identifier.SCHEDULE_REPOSITORY)
            .to(ScheduleRepository).inSingletonScope()

        // Models Ok
        this._container
            .bind(Identifier.INTEGRATION_EVENT_REPO_MODEL)
            .toConstantValue(IntegrationEventRepoModel)
        this._container
            .bind(Identifier.SERVICE_REPO_MODEL)
            .toConstantValue(ServiceRepoModel)
        this._container
            .bind(Identifier.SCHEDULE_REPO_MODEL)
            .toConstantValue(ScheduleRepoModel)

        // Mappers Ok
        this._container
            .bind<IEntityMapper<Service, ServiceEntity>>(Identifier.SERVICE_ENTITY_MAPPER)
            .to(ServiceEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Schedule, ScheduleEntity>>(Identifier.SCHEDULE_ENTITY_MAPPER)
            .to(ScheduleEntityMapper).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()
        this._container
            .bind<IConnectionFactory>(Identifier.RABBITMQ_CONNECTION_FACTORY)
            .to(ConnectionFactoryRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionEventBus>(Identifier.RABBITMQ_CONNECTION)
            .to(ConnectionRabbitMQ)
        this._container
            .bind<IEventBus>(Identifier.RABBITMQ_EVENT_BUS)
            .to(EventBusRabbitMQ).inSingletonScope()

        // Tasks
        this._container
            .bind<IBackgroundTask>(Identifier.PUBLISH_EVENT_BUS_TASK)
            .to(PublishEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.RPC_SERVER_EVENT_BUS_TASK)
            .to(RpcServerEventBusTask).inRequestScope()

        // Logs
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
