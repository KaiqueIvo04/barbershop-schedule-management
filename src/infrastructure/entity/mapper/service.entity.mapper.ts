import { injectable } from 'inversify'
import { Service } from '../../../application/domain/model/service'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { ServiceEntity } from '../service.entity'

@injectable()
export class ServiceEntityMapper implements IEntityMapper<Service, ServiceEntity> {

    public transform(item: any): any {
        if (item instanceof Service) return this.modelToModelEntity(item)
        return this.jsonToModel(item)
    }

    /**
     * Convert {Service} to {ServiceEntity}.
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown. 
     * @param item 
     * @returns 
     */
    public modelToModelEntity(item: Service): ServiceEntity {
        const result: ServiceEntity = new ServiceEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.service_name !== undefined) result.service_name = item.service_name
        if (item.description !== undefined) result.description = item.description
        if (item.price !== undefined) result.price = item.price
        if (item.estimated_duration !== undefined) result.estimated_duration = item.estimated_duration
        if (item.responsible_admin_id !== undefined) result.responsible_admin_id = item.responsible_admin_id

        return result
    }

    public jsonToModel(json: any): Service {
        const result: Service = new Service()

        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.created_at !== undefined) result.created_at = json.created_at
        if (json.updated_at !== undefined) result.updated_at = json.updated_at
        if (json.service_name !== undefined) result.service_name = json.service_name
        if (json.description !== undefined) result.description = json.description
        if (json.price !== undefined) result.price = json.price
        if (json.estimated_duration !== undefined) result.estimated_duration = json.estimated_duration
        if (json.responsible_admin_id !== undefined) result.responsible_admin_id = json.responsible_admin_id

        return result
    }
}
