import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { ISearchTrainRoute } from '../app/modules/train/train.interface';
import { ITrainRoute } from './trainRoute.schema';

export const TRAINJOURNEYSTATUS = ['DEPLAYED', 'ON-TIME'];

export interface ITrainJourney extends ITrainRoute {
    currentStatus: string;
}
const TrainJourneySchema: Schema = new Schema(
    {
        trainId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Train',
            required: true
        },
        source: {
            stationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Station',
                required: true
            },
            time: {
                type: Number,
                required: true
            }
        },
        destination: {
            stationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Station'
            },
            time: {
                type: Number,
                required: true
            }
        },
        currentStatus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TrainHistory',
            required: true
        },
        route: [
            {
                stationId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Station'
                },
                arrivalTime: Number,
                departureTime: Number,
                totalKMFromSource: Number
            }
        ]
    },
    { versionKey: false }
);

TrainJourneySchema.query.findRoute = async function (
    filter: ISearchTrainRoute
) {
    const paths = await this.exec();
    let journeyIds = [];
    paths.forEach((item) => {
        let source = item.route.find(
            (i) => i.stationId.toString() === filter.source
        );
        let destination = item.route.find(
            (i) => i.stationId.toString() === filter.destination
        );
        if (source.arrivalTime < destination.arrivalTime) {
            journeyIds.push(item._id);
        }
    });

    return this.find({ _id: { $in: journeyIds } })
        .skip(filter.offset)
        .limit(filter.limit)
        .populate([
            'trainId',
            'source.stationId',
            'destination.stationId',
            'route.stationId'
        ]);
};

export default mongoose.model('TrainJourney', TrainJourneySchema);
