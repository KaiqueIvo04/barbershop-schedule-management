// import qs from 'query-strings-parser'
import { inject, injectable } from 'inversify'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
// import { Query } from '../../infrastructure/repository/query/query'
// import { IQuery } from '../../application/port/query.interface'

@injectable()
export class RpcServerEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        this.initializeServer()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err: any) {
            return Promise.reject(new Error(`Error stopping RPC Server! ${err.message}`))
        }
    }

    private initializeServer(): void {
        // Providing users.findone.
        this._logger.info('Initializing RPC Server Event Bus Task')
        // Providing users.find
    }

    /**
     * Builds the query string based on defaults parameters and values.
     *
     * @param query
     */
    // private buildQS(query?: any): IQuery {
    //     return new Query().fromJSON(
    //         qs.parser(query ? query : {}, { pagination: { limit: Number.MAX_SAFE_INTEGER } },
    //             { use_page: true })
    //     )
    // }
}
