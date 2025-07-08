import { ServiceEntity } from '../../infrastructure/entity/service.entity'
import { BaseRepository } from './base/base.repository'
import { Service } from '../../application/domain/model/service'
import { IServiceRepository } from '../../application/port/service.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { Query } from './query/query'

@injectable()
export class ServiceRepository extends BaseRepository<Service, ServiceEntity> implements IServiceRepository {
    constructor(
        @inject(Identifier.SERVICE_REPO_MODEL) readonly _serviceRepoModel: any,
        @inject(Identifier.SERVICE_ENTITY_MAPPER) readonly _serviceEntityMapper: IEntityMapper<Service, ServiceEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_serviceRepoModel, _serviceEntityMapper, _logger)
    }

    public update(item: Service): Promise<Service | undefined> {
        const itemUp: any = this.mapper.transform(item)

        const set: any = { $set: itemUp }

        return new Promise<Service | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: itemUp.id }, set, { new: true })
                .exec()
                .then((result: ServiceEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public findById(schedule_id: string): Promise<Service | undefined> {
        return super.findOne(new Query().fromJSON({ filters: { _id: schedule_id } }))
    }

    // Check if a service already exists
    public checkExists(service: Service): Promise<Service | undefined> {
        const query: IQuery = new Query().fromJSON({
            filters: {
                _id: { $ne: service.id },
                service_name: service.service_name
            }
        })

        return this.findOne(query)
    }
}
