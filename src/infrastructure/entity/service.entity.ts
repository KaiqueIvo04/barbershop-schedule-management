import { Entity } from './entity'

export class ServiceEntity extends Entity{
    public service_name?: string
    public description?: string
    public price?: number
    public estimated_duration?: string
    public responsible_admin_id?: string
}
