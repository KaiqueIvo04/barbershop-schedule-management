import { Service } from '../domain/model/service'
import { IRepository } from './repository.interface'

export interface IServiceRepository extends IRepository<Service> {
}
