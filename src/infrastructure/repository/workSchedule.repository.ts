import { IWorkScheduleRepository } from '../../application/port/workSchedule.repository.interface'
import { WorkSchedule } from '../../application/domain/model/workSchedule'
import { WorkScheduleEntity } from '../entity/workSchedule.entity'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import { inject } from 'inversify'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { IQuery } from '../../application/port/query.interface'
import { Query } from './query/query'

export class WorkScheduleRepository extends BaseRepository<WorkSchedule, WorkScheduleEntity> implements IWorkScheduleRepository {
    constructor(
        @inject(Identifier.WORK_SCHEDULE_REPO_MODEL) readonly workScheduleRepoModel: any,
        @inject(
            Identifier.WORK_SCHEDULE_ENTITY_MAPPER
        ) readonly workScheduleEntityMapper: IEntityMapper<WorkSchedule, WorkScheduleEntity>,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ) {
        super(workScheduleRepoModel, workScheduleEntityMapper, logger)
    }

    public update(item: WorkSchedule): Promise<WorkSchedule | undefined> {
        const itemUp: any = this.mapper.transform(item)

        const set: any = { $set: itemUp }

        return new Promise<WorkSchedule | undefined>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: itemUp.id }, set, { new: true })
                .exec()
                .then((result: WorkScheduleEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public checkExists(workSchedule: WorkSchedule): Promise<WorkSchedule | undefined> {
        const query: IQuery = new Query().fromJSON({
            filters: {
                _id: { $ne: workSchedule.id },
                employee_id: workSchedule.employee_id,
                week_start_day: workSchedule.week_start_day
            }
        })

        return this.findOne(query)
    }

    public async findByEmployeeAndDay(employee_id: string, day: Date): Promise<WorkSchedule | undefined> {
        const query: IQuery = new Query()
        query.addFilter({
            employee_id
        })

        const allWorkSchedules: Array<WorkSchedule> = await this.find(query)

        if (!allWorkSchedules || allWorkSchedules.length === 0) {
            return undefined
        }

        // Filtra usando o método containsDate da classe
        const result: Array<WorkSchedule> = allWorkSchedules.filter(schedule =>
            schedule.containsDate(day)
        )

        return result[0]
    }
}
