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
import { IServiceService } from '../application/port/service.service.interface'
import { ServiceService } from '../application/services/service.service'
import { ScheduleController } from '../ui/controllers/schedule.controller'
import { ServiceController } from '../ui/controllers/service.controller'
import { IScheduleService } from '../application/port/schedule.service.interface'
import { ScheduleService } from '../application/services/schedule.service'
import { WorkScheduleController } from '../ui/controllers/workSchedule.controller'
import { IWorkScheduleService } from '../application/port/wokSchedule.service.interface'
import { WorkScheduleService } from '../application/services/workSchedule.service'
import { IWorkScheduleRepository } from '../application/port/workSchedule.repository.interface'
import { WorkScheduleRepository } from '../infrastructure/repository/workSchedule.repository'
import { WorkScheduleRepoModel } from '../infrastructure/database/schema/workSchedule.schema'
import { WorkScheduleEntity } from '../infrastructure/entity/workSchedule.entity'
import { WorkSchedule } from '../application/domain/model/workSchedule'
import { WorkScheduleEntityMapper } from '../infrastructure/entity/mapper/workSchedule.entity.mapper'
import { ScheduleStatusController } from '../ui/controllers/schedule.status.controller'

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
        this._container
            .bind(Identifier.SCHEDULE_CONTROLLER)
            .to(ScheduleController).inSingletonScope()
        this._container
            .bind(Identifier.SCHEDULE_STATUS_CONTROLLER)
            .to(ScheduleStatusController).inSingletonScope()
        this._container
            .bind(Identifier.SERVICE_CONTROLLER)
            .to(ServiceController).inSingletonScope()
        this._container
            .bind(Identifier.WORK_SCHEDULE_CONTROLLER)
            .to(WorkScheduleController).inSingletonScope()

        // Services Ok
        this._container
            .bind<IServiceService>(Identifier.SERVICE_SERVICE)
            .to(ServiceService).inSingletonScope()
        this._container
            .bind<IScheduleService>(Identifier.SCHEDULE_SERVICE)
            .to(ScheduleService).inSingletonScope()
        this._container
            .bind<IWorkScheduleService>(Identifier.WORK_SCHEDULE_SERVICE)
            .to(WorkScheduleService).inSingletonScope()

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
        this._container
            .bind<IWorkScheduleRepository>(Identifier.WORK_SCHEDULE_REPOSITORY)
            .to(WorkScheduleRepository).inSingletonScope()

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
        this._container
            .bind(Identifier.WORK_SCHEDULE_REPO_MODEL)
            .toConstantValue(WorkScheduleRepoModel)

        // Mappers Ok
        this._container
            .bind<IEntityMapper<Service, ServiceEntity>>(Identifier.SERVICE_ENTITY_MAPPER)
            .to(ServiceEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Schedule, ScheduleEntity>>(Identifier.SCHEDULE_ENTITY_MAPPER)
            .to(ScheduleEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<WorkSchedule, WorkScheduleEntity>>(Identifier.WORK_SCHEDULE_ENTITY_MAPPER)
            .to(WorkScheduleEntityMapper).inSingletonScope()

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
