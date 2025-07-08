import { Service } from '../domain/model/service'
import { IRepository } from './repository.interface'

export interface IServiceRepository extends IRepository<Service> {
    checkExists(service: Service): Promise<Service | undefined>
    findById(service_id: string): Promise<Service | undefined>
}
