import { Service } from '../../../src/application/domain/model/service'
import { DefaultFunctions } from '../utils/default.functions'

export class ServiceMock {
    public static generate(): Service {
        const service: Service = new Service()
        service.id = DefaultFunctions.generateObjectId()
        service.service_name = 'Corte de Cabelo Masculino'
        service.description = 'Corte tradicional ou moderno com finalização'
        service.price = 50.0
        service.estimated_duration = 30 // em minutos
        service.responsible_admin_id = DefaultFunctions.generateObjectId()
        return service
    }
}
