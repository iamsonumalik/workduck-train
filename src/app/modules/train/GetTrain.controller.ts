import { passwordRegex } from '../../utils/regex.utils';
import { TrainService } from './train.service';
import { ISearchTrainRoute } from './train.interface';
import * as moment from 'moment';

const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class GetTrainController extends MasterController {
    static doc() {
        return {
            tags: ['Train'],
            description: 'Search available trains',
            summary: ''
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                sourceId: Joi.string().required(),
                destinationId: Joi.string().required(),
                travelDate: Joi.string().required(),
                limit: Joi.number().default(10),
                offset: Joi.number().default(0)
            })
        );
        return payload;
    }

    async controller() {
        const {
            sourceId,
            destinationId,
            travelDate,
            limit = 10,
            offset = 0
        } = this.data;
        if (!passwordRegex.test(travelDate)) {
            return new this.ResponseBuilder(
                200,
                {
                    sourceId,
                    destinationId,
                    travelDate
                },
                'travelDate should be in YYYY-MM-DD'
            );
        }
        const fromDate = moment(travelDate);
        console.log(fromDate.format());
        const filter: ISearchTrainRoute = {
            source: sourceId,
            destination: destinationId,
            travelDate: fromDate.valueOf(),
            upto: fromDate.add(8, 'days').valueOf(),
            limit: Number(limit),
            offset: Number(offset)
        };
        const result = await TrainService.instance().getTrains(filter);
        return new this.ResponseBuilder(
            200,
            {
                result
            },
            'success'
        );
    }
}
