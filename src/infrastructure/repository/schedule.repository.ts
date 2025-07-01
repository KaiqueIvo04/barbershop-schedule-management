import { ScheduleEntity } from '../../infrastructure/entity/schedule.entity'
import { BaseRepository } from './base/base.repository'
import { Schedule } from '../../application/domain/model/schedule'
import { IScheduleRepository } from '../../application/port/schedule.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { Query } from './query/query'

@injectable()
export class ScheduleRepository extends BaseRepository<Schedule, ScheduleEntity> implements IScheduleRepository {
    constructor(
        @inject(Identifier.SCHEDULE_REPO_MODEL) readonly _scheduleRepoModel: any,
        @inject(Identifier.SCHEDULE_ENTITY_MAPPER) readonly _scheduleEntityMapper: IEntityMapper<Schedule, ScheduleEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_scheduleRepoModel, _scheduleEntityMapper, _logger)
    }

    public update(item: Schedule): Promise<Schedule | undefined> {
        const itemUp: any = this.mapper.transform(item)

        const set: any = { $set: itemUp }

        return new Promise<Schedule | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: itemUp.id }, set, { new: true })
                .exec()
                .then((result: ScheduleEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public updateStatusById(schedule_id: string, newStatus: string): Promise<Schedule | undefined> {
        const statusUp = { status: newStatus }

        return new Promise<Schedule | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: schedule_id }, statusUp, { new: true })
                .exec()
                .then((result: ScheduleEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this._scheduleEntityMapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    // Check if a schedule already exists
    public checkExists(schedule: Schedule): Promise<Schedule | undefined> {
        const query: IQuery = new Query().fromJSON({
            filters: {
                _id: { $ne: schedule.id },
                date_schedule: schedule.date_schedule,
                responsible_employee_id: schedule.responsible_employee_id,
                responsible_client_id: schedule.responsible_client_id,
            }
        })

        return this.findOne(query)
    }

    public findById(schedule_id: string): Promise<Schedule | undefined> {
        return super.findOne(new Query().fromJSON({ filters: { _id: schedule_id } }))
    }

    public findByEmployeeAndDate(employee_id: string, date: Date): Promise<Array<Schedule> | undefined> {
        const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
        const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1))

        const query: IQuery = new Query().fromJSON({
            filters: {
                responsible_employee_id: employee_id,
                date_schedule: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            }
        })

        return this.find(query)
    }
}
