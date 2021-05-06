import { StationService } from './station.service';
import { IStationSearch } from './station.interface';
import { IStation } from '../../../models/station.schema';

const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class GetStationsControllers extends MasterController {
    static doc() {
        return {
            tags: ['Station'],
            description:
                'This api helps you to fetch all available station based on you search.',
            summary: ''
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                search: Joi.string(),
                limit: Joi.number().default(10),
                offset: Joi.number().default(0)
            })
        );
        return payload;
    }

    async controller() {
        const { search = '', limit = 10, offset = 0 } = this.data;
        const searchInterface: IStationSearch = {
            search,
            limit,
            offset
        };
        const result: [IStation] = await StationService.instance().getStations(
            searchInterface
        );
        if (!result) {
            return new this.ResponseBuilder(
                400,
                {},
                'unable to fetch stations'
            );
        }
        return new this.ResponseBuilder(200, { result }, 'success');
    }
}
