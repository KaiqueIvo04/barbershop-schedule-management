import { ServiceEntity } from '../../infrastructure/entity/service.entity'
import { BaseRepository } from './base/base.repository'
import { Service } from '../../application/domain/model/service'
import { IServiceRepository } from '../../application/port/service.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'

@injectable()
export class ServiceRepository extends BaseRepository<Service, ServiceEntity> implements IServiceRepository{
    constructor(
        @inject(Identifier.SERVICE_REPO_MODEL) readonly _serviceRepoModel: any,
        @inject(Identifier.SERVICE_ENTITY_MAPPER) readonly _serviceEntityMapper: IEntityMapper<Service, ServiceEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ){
        super(_serviceRepoModel, _serviceEntityMapper, _logger)
    }
}
