import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { IStation } from './station.schema';
import { ITrain } from './train.schema';

export interface ITrainRouteRoute {
    _id: string;
    stationId: IStation;
    arrivalTime: number;
    departureTime: number;
    totalKMFromSource: number;
}

export interface ITRSDStation {
    stationId: IStation['_id'];
    time: number;
}

export interface ITrainRoute extends Document {
    _id?: string;
    trainId: ITrain;
    source: ITRSDStation;
    destination: ITRSDStation;
    route: [ITrainRouteRoute];
}

const TrainRouteSchema: Schema = new Schema(
    {
        trainId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Train'
        },
        source: {
            stationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Station'
            },
            time: {
                type: Number,
                default: 0
            }
        },
        destination: {
            stationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Station'
            },
            time: Number
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

export default mongoose.model('TrainRoute', TrainRouteSchema);
