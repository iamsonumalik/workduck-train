import Train, { ITrain } from '../../../models/train.schema';
import TrainJourney from '../../../models/trainJourney.schema';
import { ITrainRoute } from '../../../models/trainRoute.schema';
import { ISearchTrainRoute, ITrainArrivals } from './train.interface';

const { MasterService } = require('base-packages');

export class TrainService extends MasterService {
    getTrain(trainId: ITrain['_id']) {
        return Train.findById({ trainId });
    }

    getTrainJourney(trainJourneyId: ITrainRoute['_id']) {
        return TrainJourney.findById(trainJourneyId).populate([
            'route.stationId',
            'trainId',
            {
                path: 'currentStatus',
                populate: 'station'
            }
        ]);
    }

    getTrains(filter: ISearchTrainRoute) {
        const findObj = {
            route: {
                $elemMatch: {
                    stationId: filter.source,
                    arrivalTime: {
                        $gt: filter.travelDate,
                        $lt: filter.upto
                    }
                }
            },
            'route.stationId': filter.destination
        };
        console.log(JSON.stringify(findObj));
        // @ts-ignore
        return TrainJourney.find(findObj).findRoute(filter);
    }

    getAllTrainsBetween(filter: ITrainArrivals) {
        const findObj = {
            route: {
                $elemMatch: {
                    stationId: filter.station,
                    arrivalTime: {
                        $gte: filter.fromDate,
                        $lte: filter.toDate
                    }
                }
            }
        };
        return TrainJourney.find(findObj)
            .skip(filter.offset)
            .limit(filter.offset)
            .populate(['trainId', 'source.stationId', 'destination.stationId']);
    }
}
