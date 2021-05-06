import { TrainService } from './train.service';
import { ITrainJourney } from '../../../models/trainJourney.schema';

const { MasterController, RequestBuilder, Joi } = require('base-packages');

export default class GetTrainStopsController extends MasterController {
    static doc() {
        return {
            tags: ['Train'],
            description: 'List all stops of any train Journey',
            summary: ''
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToPath(
            Joi.object().keys({
                trainJourneyId: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        const { trainJourneyId } = this.data;
        const result: ITrainJourney = await TrainService.instance().getTrainJourney(
            trainJourneyId
        );
        if (!result) {
            return new this.ResponseBuilder(404, {}, 'Train journey not found');
        }
        const route = result.route;
        return new this.ResponseBuilder(200, { route }, 'success');
    }
}
