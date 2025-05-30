import { ScheduleEntity } from '../../infrastructure/entity/schedule.entity'
import { BaseRepository } from './base/base.repository'
import { Schedule } from '../../application/domain/model/schedule'
import { IScheduleRepository } from '../../application/port/schedule.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'

@injectable()
export class ScheduleRepository extends BaseRepository<Schedule, ScheduleEntity> implements IScheduleRepository{
    constructor(
        @inject(Identifier.SCHEDULE_REPO_MODEL) readonly _scheduleRepoModel: any,
        @inject(Identifier.SCHEDULE_ENTITY_MAPPER) readonly _scheduleEntityMapper: IEntityMapper<Schedule, ScheduleEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ){
        super(_scheduleRepoModel, _scheduleEntityMapper, _logger)
    }
}
