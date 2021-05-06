import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { TRAINJOURNEYSTATUS } from './trainJourney.schema';

export interface ITrainHistory extends Document {
    _id: string;
    name: string;
}

export const TRAINHISTORYSTATUS = ['ARRIVED', 'DEPARTED'];

const TrainHistorySchema: Schema = new Schema(
    {
        trainJourney: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TrainJourney'
        },
        station: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station'
        },
        type: {
            type: String,
            enum: TRAINHISTORYSTATUS
        },
        expectedTime: Number,
        actualTime: Number,
        status: {
            type: String,
            enum: TRAINJOURNEYSTATUS
        }
    },
    { versionKey: false }
);

export default mongoose.model('TrainHistory', TrainHistorySchema);
