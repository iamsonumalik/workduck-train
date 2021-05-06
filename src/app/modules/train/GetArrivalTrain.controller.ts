import { passwordRegex } from '../../utils/regex.utils';
import { TrainService } from './train.service';
import { ITrainArrivals } from './train.interface';
import * as moment from 'moment';

const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class GetArrivalTrainController extends MasterController {
    static doc() {
        return {
            tags: ['Train'],
            description: 'List all trains arriving at station',
            summary: ''
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToPath(
            Joi.object().keys({
                stationId: Joi.string().required()
            })
        );
        payload.addToQuery(
            Joi.object().keys({
                fromDate: Joi.string().required(),
                toDate: Joi.string().required(),
                limit: Joi.number().default(10),
                offset: Joi.number().default(0)
            })
        );
        return payload;
    }

    async controller() {
        const {
            stationId,
            fromDate,
            toDate,
            limit = 10,
            offset = 0
        } = this.data;
        if (!passwordRegex.test(fromDate)) {
            return new this.ResponseBuilder(
                200,
                {
                    stationId,
                    fromDate
                },
                'fromDate should be in YYYY-MM-DD'
            );
        }
        if (!passwordRegex.test(toDate)) {
            return new this.ResponseBuilder(
                200,
                {
                    stationId,
                    toDate
                },
                'toDate should be in YYYY-MM-DD'
            );
        }
        const filter: ITrainArrivals = {
            station: stationId,
            fromDate: moment(fromDate).valueOf(),
            toDate: moment(toDate).valueOf(),
            limit: Number(limit),
            offset: Number(offset)
        };
        const result = await TrainService.instance().getAllTrainsBetween(
            filter
        );
        return new this.ResponseBuilder(
            200,
            {
                result
            },
            'success'
        );
    }
}
